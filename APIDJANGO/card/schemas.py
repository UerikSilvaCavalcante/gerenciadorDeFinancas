from ninja import Schema, ModelSchema
from .models import CardModel
from typing import List
from transfer.schemas import ResponseListTransferSchema
from decimal import Decimal

class CardSchema(ModelSchema):
    class Config:
        model = CardModel
        model_fields = ['user', 'bander', 'bank', 'type_card', 'limit', 'color']

class ResponseCardSchema(Schema):
    id: int;
    user: int;

    bander: str
    bank: str
    type_card: str
    limit: Decimal
    color: str

class ResponseDetailSchema(Schema):
    card: ResponseCardSchema;
    transfers: List[ResponseListTransferSchema]
    total_value: Decimal
    limit: Decimal | None