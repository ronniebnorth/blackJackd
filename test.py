def sayhi(nameString):
    print("hello " + nameString)

def getname():
    nm = input("What is your name?")
    if(nm == "Bill"):
        nm = "Dickhead"
    return nm


sayhi(getname())