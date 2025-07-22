from django.forms import model_to_dict
from ninja import Router
from card.schemas import ResponseCardSchema
from card.models import CardModel
from transfer.models import Transfer
from django.shortcuts import get_object_or_404, get_list_or_404
from datetime import datetime
import pandas as pd

router = Router()

@router.get('/plts/{int:id}' )
def get_plts(request, id:int):
    act_month = datetime.now().month
    past_month = act_month - 1 if act_month > 1 else 12
    transfer_act = Transfer.objects.filter(user_id=id, date__month=act_month)
    transfer_past = Transfer.objects.filter(user_id=id, date__month=past_month)
    gastos_act = [transfer.value for transfer in transfer_act]
    gastos_past = [transfer.value for transfer in transfer_past]
    days_act = [transfer.date.day for transfer in transfer_act]
    days_past = [transfer.date.day for transfer in transfer_past]
    df_act = pd.DataFrame({'Dias': days_act, 'Mes': act_month, 'Gastos': gastos_act})
    df_past = pd.DataFrame({'Dias': days_past, 'Mes': past_month, 'Gastos': gastos_past})
    df = pd.concat([df_act, df_past], ignore_index=True)

    
    return {
        'eixoX': list(df['Dias']),
        'eixoY': list(df['Gastos']),
        'meses': list(df['Mes'])
    }