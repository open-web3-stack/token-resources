import tokenList from "../../resources/tokens.json";
const PUBLIC_HOST = 'https://token-resources-chi.vercel.app';

Object.entries(tokenList).forEach(([key, value]) => {
  value.icon = PUBLIC_HOST + value.icon
})

const tokens = JSON.stringify(tokenList)

export default function handler(req, res) {
  res.status(200).json(tokens)
}