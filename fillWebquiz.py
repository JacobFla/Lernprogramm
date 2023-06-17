import requests
import json

url = "https://irene.informatik.htw-dresden.de:8888/api/quizzes"
username = "jfla42@gmail.com"
password = "supersecretpassword"

headers = {
    "Content-Type": "application/json",
}

dataArray = [
    {"title":"Personen", "text":"Wann wurde Albert Einstein geboren?", "options":["1905","1879","1925","1839"], "answer": [1]},
    {"title":"Personen", "text":"Wann wurde Isaac Newton geboren?", "options":["1643","1479","1225","1750"], "answer": [0]},
    {"title":"Personen", "text":"Wann wurde Marie Curie geboren?", "options":["1829","1802","1915","1867"], "answer": [3]},
    {"title":"Personen", "text":"Wann wurde Nikola Tesla geboren?", "options":["1856","1899","1925","1803"], "answer": [0]},
    {"title":"Personen", "text":"Wann wurde Konrad Zuse geboren?", "options":["1897","1929","1910","1878"], "answer": [2]},
    {"title":"Personen", "text":"Wann wurde Alan Turing geboren?", "options":["1875","1921","1890","1912"], "answer": [3]},
    {"title":"Personen", "text":"Wann wurde Charles Darwin geboren?", "options":["1771","1809","1841","1711"], "answer": [1]},
    {"title":"Personen", "text":"Wann wurde Stephen Hawking geboren?", "options":["1898","1959","1942","1921"], "answer": [2]}
]

for i in range(0, len(dataArray)):
    payload = json.dumps(dataArray[i])
    response = requests.post(url, data=payload, headers=headers, auth=(username, password))
    if response.status_code == 200:
        print("Quiz erfolgreich erstellt")
        print(response.text)
    else:
        print("Fehler beim Senden: ", response.status_code)
        print(response.text)
