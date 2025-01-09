import networkList from "../../resources/networks.json";
const PUBLIC_HOST = 'https://token-resources-chi.vercel.app';

Object.entries(networkList).forEach(([key, value]) => {
  value.icon = PUBLIC_HOST + value.icon
})

const networks = JSON.stringify(networkList)

export default function handler(req, res) {
  res.status(200).json(networks)
}