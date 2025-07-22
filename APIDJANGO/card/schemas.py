from ninja import Schema, ModelSchema
from .models import CardModel
from typing import List
from transfer.schemas import ResponseTransferSchema
from decimal import Decimal

class CardSchema(ModelSchema):
    class Config:
        model = CardModel
        model_fields = ['user', 'brand', 'bank', 'type_card', 'limit', 'closing_date']

class ResponseCardSchema(ModelSchema):
    class Config:
        model = CardModel
        model_fields = ['id', 'brand', 'bank', 'type_card', 'limit', 'closing_date']

class ResponseDetailSchema(Schema):
    card: ResponseCardSchema;
    transfers: List[ResponseTransferSchema]
    total_value: Decimal