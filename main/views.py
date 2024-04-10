from ast import Str
from datetime import date
from django.shortcuts import render

# http://127.0.0.1:8000/APIGET?NQ=1&Sathi=101.0&Temp=25.6&PH=8.8&Slnt=0&DT=2016-05-17%2015:40:33
from django.http import HttpResponse

from main.models import Quduglar, korsatgichlari

def APIGET(request):
    erb= bool(request.GET)
    if erb:
        try:
            NQuduq=int(request.GET["NQ"])
            sath=float(request.GET["Sathi"])
            temp=float(request.GET["Temp"])
            PH=float(request.GET["PH"])
            Sim=float(request.GET["Slnt"])
            timeDate=request.GET["DT"]
            q_id=NQuduq
            content = {
                'titel':'API',
                'sath':sath,
                'temp':temp,
                'PH':PH,
                'Sim':Sim,
                'date':timeDate,
                'erb':erb
            }
            Qudug=Quduglar.objects.all()    
 #           params=korsatgichlari.objects.order_by("-mes_date").filter(quduq_id=q_id)
            params=korsatgichlari(quduq_id=q_id,sath_quduq=sath,tempInC=temp,PH=PH,Sim=Sim,mes_date=timeDate)
            params.save()                       
        except ValueError:
            content = {
                'titel':'Xato',
                'sath':0,
                'temp':0,
                'PH':0,
                'Sim':0,
                'date':'000000',
                'erb':False
            }
            pass
#        Qudug=Quduglar.objects.all()    
#        params=korsatgichlari.objects.filter(quduq_id=q_id)
    else:
        content = {
        'titel':'xato API',
        'err':'Xoto API korsatgichlar',
        'erb':erb        
#        'quduq':Qudug[q_id-1],
#        'param':params
        }
    return render(request,'APIGET.html',content)
    
def home(request,q_slug):
    q_id=int(q_slug)
    Qudug=Quduglar.objects.all()    
    params=korsatgichlari.objects.order_by("-mes_date").filter(quduq_id=q_id)
   
    content = {
    'titel':'Dayver malumotlari',
    'quduq':Qudug[q_id-1],
    'param':params
    }
    return render(request,'home.html',content)

def about(request):
    content = {
    'titel':'Haqimizda',
    'Content':"Qisaqcha ma'lumot"
     }
    return render(request,'about.html',content)

def index(request):
    Qudug=Quduglar.objects.all() 
    content = {
    'titel':'Bosh sahifa',
    'qdq':Qudug
     }
    return render(request,'index.html',content)

def develop(request):
    content = {
    'titel':'Bosh sahifa',
    'Content':"Quduqlar joylashuvi"
     }
    return render(request,'develop.html',content)