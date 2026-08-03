from urllib import response

import requests

from src.config import (
    ZOHO_CLIENT_ID,
    ZOHO_CLIENT_SECRET,
    ZOHO_REFRESH_TOKEN,
    ZOHO_ORGANIZATION_ID,
)


class ZohoBooksClient:

    BASE_URL = "https://www.zohoapis.in/books/v3"

    def get_access_token(self):
        response = requests.post(
            "https://accounts.zoho.in/oauth/v2/token",
            params={
                "refresh_token": ZOHO_REFRESH_TOKEN,
                "client_id": ZOHO_CLIENT_ID,
                "client_secret": ZOHO_CLIENT_SECRET,
                "grant_type": "refresh_token",
            },
        )
        response.raise_for_status()
        return response.json()["access_token"]

    def create_expense(self, expense):
        token = self.get_access_token()

        headers = {
            "Authorization": f"Zoho-oauthtoken {token}"
        }

        payload = {
        "date": expense.date,
        "amount": expense.amount,
        "currency_code": expense.currency,
        "reference_number": expense.bill_number,
        "notes": expense.vendor,
        "account_id": "4031600000000000558",}

        response = requests.post(
            f"{self.BASE_URL}/expenses",
            params={
                "organization_id": ZOHO_ORGANIZATION_ID,
            },
            headers=headers,
            json=payload,
        )

        response.raise_for_status()
        return response.json()