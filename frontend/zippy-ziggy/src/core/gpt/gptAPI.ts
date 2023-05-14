import axios from 'axios';

export async function postCompletions(req, res) {
  const { prompt, tokens } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt,
        max_tokens: tokens || 50,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GPT_KEY}`,
        },
      }
    );

    res.status(200).json(response.data.choices[0].text);
  } catch (error) {
    res.status(500).json({ error });
  }
}

export const getText = async (e) => {
  try {
    const response = await fetch('/api/generateText', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    return { result: 'SUCCESS', data };
  } catch (error) {
    console.error(error);
    return { result: 'FAIL' };
  }
};
