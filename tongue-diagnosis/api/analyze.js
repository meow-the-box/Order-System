// Vercel Serverless Function for tongue analysis
// This proxies requests to Google Gemini API to keep the API key secure

export const config = {
  maxDuration: 30, // 30 seconds timeout
};

const PROMPT = `你是一位专业的中医舌诊专家。请仔细观察这张照片。

**首先判断**：
1. 这是否是一张清晰的舌头照片？如果不是舌头（如手指、桌面、其他物体），必须返回 isValidTongue: false
2. 照片光线是否正常？是否有明显偏色（过曝、偏黄、偏蓝等）？

**如果是有效的舌头照片**，请根据中医舌诊理论分析：
- 舌色：淡白/淡红/红/绛/青紫
- 舌形：胖大/正常/瘦小，是否有齿痕/裂纹
- 舌苔颜色：白/黄/灰/黑
- 舌苔厚薄：薄/厚
- 舌苔性质：润/燥/腻/腐
- 体质类型（九种之一）
- 调理建议

请只返回 JSON 格式，不要其他文字：
{
  "isValidTongue": true或false,
  "invalidReason": "如果不是有效舌头照片，说明原因（如：这不是舌头照片/照片模糊/光线不足）",
  "hasLightingIssue": true或false,
  "lightingWarning": "如果光线有问题，给出提示（如：照片偏黄，可能影响判断准确性，建议在自然光下重新拍摄）",
  "tongueColor": "舌色",
  "tongueShape": "舌形",
  "hasTeethMarks": true或false,
  "hasCracks": true或false,
  "coatingColor": "苔色",
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

    // Call Gemini API - using gemini-2.0-flash (stable, free tier with vision)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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

      // Parse error for better messages
      let errorMessage = 'AI 分析失败，请稍后重试';
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          console.error('Gemini Error Detail:', errorData.error.message);
        }
      } catch (e) {
        // ignore parse error
      }

      if (response.status === 429) {
        errorMessage = '请求太频繁，请稍后再试（每分钟限制 15 次）';
      } else if (response.status === 400) {
        errorMessage = '图片格式不支持，请使用 JPG/PNG 格式';
      } else if (response.status === 403) {
        errorMessage = 'API 密钥无效或已过期';
      } else if (response.status === 404) {
        errorMessage = 'AI 服务暂时不可用，请稍后重试';
      }

      return res.status(response.status).json({ message: errorMessage });
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

      // TC-04: Check if it's a valid tongue image
      if (result.isValidTongue === false) {
        return res.status(400).json({
          message: result.invalidReason || '请上传清晰的舌头照片',
          isInvalidImage: true,
        });
      }

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
