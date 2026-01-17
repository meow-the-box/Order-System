// Vercel Serverless Function for tongue analysis
// This proxies requests to Google Gemini API to keep the API key secure

export const config = {
  maxDuration: 30, // 30 seconds timeout
};

const PROMPT = `你是一位专业的中医舌诊专家。请仔细观察这张舌头照片，根据中医舌诊理论进行分析。

请按以下维度分析：
1. 舌色：淡白/淡红/红/绛/青紫
2. 舌形：胖大/正常/瘦小，是否有齿痕/裂纹
3. 舌苔颜色：白/黄/灰/黑
4. 舌苔厚薄：薄/厚
5. 舌苔性质：润/燥/腻/腐
6. 判断最可能的体质类型（平和质/气虚质/阳虚质/阴虚质/痰湿质/湿热质/血瘀质/气郁质/特禀质）
7. 给出饮食、生活方式、穴位按摩建议

请只返回 JSON 格式，不要其他文字：
{
  "tongueColor": "舌色（淡白/淡红/红/绛/青紫）",
  "tongueShape": "舌形（胖大/正常/瘦小）",
  "hasTeethMarks": true或false,
  "hasCracks": true或false,
  "coatingColor": "苔色（白/黄/灰/黑）",
  "coatingThickness": "薄或厚",
  "coatingTexture": "润/燥/腻/腐",
  "constitution": "体质类型",
  "confidence": "高/中等/低",
  "features": ["特征1", "特征2", "特征3"],
  "healthStatus": "简短的健康状态描述",
  "recommendations": {
    "diet": ["食物1", "食物2", "食物3", "食物4"],
    "lifestyle": ["建议1", "建议2", "建议3"],
    "acupoints": ["穴位1", "穴位2", "穴位3"]
  }
}`;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只支持 POST 请求' });
  }

  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ message: '缺少图片数据' });
  }

  // Check API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY not configured');
    return res.status(500).json({ message: '服务配置错误，请联系管理员' });
  }

  try {
    // Extract base64 data (remove prefix if present)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: base64Data,
                  },
                },
                {
                  text: PROMPT,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_NONE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_NONE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_NONE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_NONE',
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', response.status, errorText);

      // Handle rate limiting
      if (response.status === 429) {
        return res.status(429).json({
          message: '请求太频繁，请稍后再试（每分钟限制 15 次）',
        });
      }

      return res.status(500).json({ message: 'AI 分析失败，请稍后重试' });
    }

    const data = await response.json();

    // Check for blocked content
    if (data.candidates?.[0]?.finishReason === 'SAFETY') {
      return res.status(400).json({
        message: '图片无法识别，请确保拍摄的是清晰的舌头照片',
      });
    }

    // Extract text content
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('No text in response:', JSON.stringify(data));
      return res.status(500).json({ message: '未能获取分析结果' });
    }

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', text);
      return res.status(500).json({ message: '结果解析失败，请重试' });
    }

    try {
      const result = JSON.parse(jsonMatch[0]);

      // Validate required fields
      if (!result.constitution || !result.tongueColor) {
        console.error('Missing required fields:', result);
        return res.status(500).json({ message: '分析结果不完整，请重试' });
      }

      return res.status(200).json(result);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, jsonMatch[0]);
      return res.status(500).json({ message: '结果解析失败，请重试' });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
}
