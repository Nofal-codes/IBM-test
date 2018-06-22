#!/usr/bin/python
from http.server import BaseHTTPRequestHandler, HTTPServer, SimpleHTTPRequestHandler
from os import curdir, sep
import RPi.GPIO as GPIO
from time import sleep
import threading

##########################
## changeable variables ##
##########################
PORT_NUMBER = 8080     # Server port
rightChannel = 17       # GPIO pins
leftChannel = 18       # GPIO pins
mySpeed = 50       # motor speed 100 is full forward, and -100 is full reverse
drivePeriod = 1        # How long will the robot turn for

frequency = 50  # vex motor signal frequency  for controller 29
maxPWD = 11  # vex motor PWD duty cycle width for controller 29 full speed forward
minPWD = 3  # vex motor PWD duty cycle width for controller 29 full speed reverse

##########################
## System own calc      ##
##########################

# GPIO preparing
GPIO.setmode(GPIO.BCM)  # Use GPIO numbers not pin numbers
GPIO.setup(rightChannel, GPIO.OUT)  # set up the GPIO channels -  one output
GPIO.setup(leftChannel,  GPIO.OUT)  # set up the GPIO channels -  one output

# speed equation generator
def speed(x):
    return ((minPWD - maxPWD)/-200)*x + maxPWD - (((minPWD - maxPWD)/-200)*100)

frontSpeed = speed(mySpeed)
backSpeed = speed(-mySpeed)
active = False


# driving functions
def goFront():
    global active
    if not active:
        active = True
        pL = GPIO.PWM(leftChannel, frequency)
        pR = GPIO.PWM(rightChannel, frequency)
        pL.start(frontSpeed)
        pR.start(backSpeed)
        sleep(drivePeriod)
        pL.stop()
        pR.stop()
        print("go front")
        active = False


def goBack():
    global active
    if not active:
        active = True
        pL = GPIO.PWM(leftChannel, frequency)
        pR = GPIO.PWM(rightChannel, frequency)
        pL.start(backSpeed)
        pR.start(frontSpeed)
        sleep(drivePeriod)
        pL.stop()
        pR.stop()
        print("go back")
        active = False


def goLeft():
    global active
    if not active:
        active = True
        pL = GPIO.PWM(leftChannel, frequency)
        pR = GPIO.PWM(rightChannel, frequency)
        pL.start(0.5*backSpeed)
        pR.start(0.5*backSpeed)
        sleep(drivePeriod)
        pL.stop()
        pR.stop()
        print("go left")
        active = False


def goRight():
    global active
    if not active:
        active = True
        pL = GPIO.PWM(leftChannel, frequency)
        pR = GPIO.PWM(rightChannel, frequency)
        pL.start(0.5*frontSpeed)
        pR.start(0.5*frontSpeed)
        sleep(drivePeriod)
        pL.stop()
        pR.stop()
        print("go right")
        active = False

##########################
##     Server class     ##
##########################
# This class will handles any incoming request from
# the browser


class myHandler(BaseHTTPRequestHandler):
    
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

    # Handler for the GET requests
    def do_GET(self):

        try:
            # goRight()
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(bytes(self.path, 'utf8'))

            if self.path == "/front":
                threading.Thread(target=goFront, args=[]).start()
                #goFront()
            if self.path == "/left":
                threading.Thread(target=goLeft, args=[]).start()
            if self.path == "/right":
                threading.Thread(target=goRight, args=[]).start()
            if self.path == "/back":
                threading.Thread(target=goBack, args=[]).start()

            return

        except IOError:
            self.send_error(404, 'File Not Found: %s' % self.path)


try:
    # Create a web server and define the handler to manage the
    # incoming request
    server = HTTPServer(('', PORT_NUMBER), myHandler)
    print('Started httpserver on port ', PORT_NUMBER)

    # Wait forever for incoming htto requests
    server.serve_forever()

except KeyboardInterrupt:
    print('^C received, shutting down the web server')
    server.socket.close()
