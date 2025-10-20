from django.forms import model_to_dict
from ninja import Router
from card.schemas import ResponseCardSchema
from card.models import CardModel
from transfer.models import Transfer
from django.shortcuts import get_object_or_404, get_list_or_404
from datetime import datetime
import pandas as pd
from .schemas import PltsMesSchema,  ResponseGastosSchema, ResponseTransfersSchema
from typing import List

router = Router()

@router.get('/plts/mes/{int:id}' , response=List[PltsMesSchema])
def get_plts_mes(request, id:int):
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
    df_grouped = df.groupby(['Mes', 'Dias'], as_index=False, sort=True, )['Gastos'].sum()

    dias_act =list(df_grouped[df_grouped['Mes'] == act_month]['Dias'])
    gastos_act = list(df_grouped[df_grouped['Mes'] == act_month]['Gastos'])
    dias_past = list(df_grouped[df_grouped['Mes'] == past_month]['Dias'])
    gastos_past = list(df_grouped[df_grouped['Mes'] == past_month]['Gastos'])
    days = list(set(dias_act + dias_past))
    
    days.sort()
    gastos_act = [gastos_act[dias_act.index(day)] if day in dias_act else 0 for day in days]
    gastos_past = [gastos_past[dias_past.index(day)] if day in dias_past else 0 for day in days]
    response = []
    for day in days:
        response.append({
            "day": day,
            'act_mounth': gastos_act[days.index(day)],
            'past_mounth': gastos_past[days.index(day)]
        })

    
    return response
@router.get('/plts/gastos/{int:id}', response=List[ResponseGastosSchema])
def get_plts_gastos(request, id:int):

    act_month = datetime.now().month
    transfers = Transfer.objects.filter(user_id=id, date__month=act_month)

    tipos = [transfer.get_type_transfer_display() for transfer in transfers]
    gastos = [transfer.value for transfer in transfers]
    df = pd.DataFrame({'Tipos': tipos, 'Gastos': gastos})
    df_grouped = df.sort_values(by="Gastos", ascending=False)
    df_grouped = df_grouped.groupby('Tipos', as_index=False)['Gastos'].sum()
    types = list(df_grouped['Tipos'])[:5]
    gastos = list(df_grouped['Gastos'])[:5]
    response = []
    for tp in types:
        response.append({
            'categoria': tp,
            'gasto': gastos[types.index(tp)]
        })

    return response

@router.get('/transfers/{int:id}', response=List[ResponseTransfersSchema])
def get_transfers(request, id:int):
    transfers = Transfer.objects.filter(user_id=id).order_by('-date')[:5]
    for transfer in transfers:
        transfer.date = transfer.date.strftime('%d/%m/%Y')
    return [model_to_dict(transfer, fields=['id', 'value', 'date', 'type_transfer']) for transfer in transfers]