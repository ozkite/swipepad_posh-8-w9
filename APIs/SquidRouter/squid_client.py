# squid_client.py
import requests

class SquidRouter:
    BASE_URL = "https://api.squidrouter.com/v1"

    def __init__(self, api_key: str):
        self.api_key = api_key

    def quote(self, from_token: str, to_token: str, amount: float):
        headers = {"x-api-key": self.api_key}
        params = {
            "fromToken": from_token,
            "toToken": to_token,
            "amount": amount
        }
        response = requests.get(f"{self.BASE_URL}/quote", headers=headers, params=params)
        return response.json()

    def swap(self, from_chain: int, to_chain: int, from_token: str, to_token: str, amount: float, recipient: str):
        payload = {
            "fromChainId": from_chain,
            "toChainId": to_chain,
            "fromToken": from_token,
            "toToken": to_token,
            "amount": amount,
            "toAddress": recipient
        }
        headers = {"x-api-key": self.api_key}
        response = requests.post(f"{self.BASE_URL}/swap", json=payload, headers=headers)
        return response.json()

# Example usage
if __name__ == "__main__":
    client = SquidRouter(api_key="your_api_key")
    result = client.quote("USDC", "USDT", 100)
    print(result)
