from ninja import ModelSchema,Schema
from .models import Transfer
from decimal import Decimal
from card.models import CardModel

class TransferSchema(ModelSchema):
    class Config:
        model = Transfer
        model_fields = ['user_id', 'value','date', 'description', 'type_transfer', 'payment_method', 'card_id']

class ResponseTransferSchema(Schema):
    id:int
    value:Decimal
    date:str
    description:str
    type_transfer:str
    payment_method:str
    card_id:str | None = None

from typing import List, Dict

class TransferListItemSchema(Schema):
    id: int
    value: Decimal
    date: str
    type_transfer: str
    payment_method: str



class ResponseListTransferSchema(Schema):
    month: str
    transfers: List[TransferListItemSchema]