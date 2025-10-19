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
    type_transfer:int
    payment_method:int
    card_id: int | None = None


from typing import List, Dict

class TransferListItemSchema(Schema):
    id: int
    value: Decimal
    type_transfer: int
    desc: str | None
    payment_method: str

class TransferDaySchema(Schema):
    day: str
    valueTot: Decimal
    transfers: List[TransferListItemSchema]


class ResponseListTransferSchema(Schema):
    mounth: str
    days: List[TransferDaySchema]

class ResponseListStatic(ModelSchema):
    class Config:
        model = Transfer
        model_fields = ['id']