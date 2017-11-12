

from __future__ import print_function
import requests
server_api="""http://35.202.31.234:7000/query"""
# server_api="""http://127.0.0.1:7000/test"""

# --------------- Helpers that build all of the responses ----------------------

def build_speechlet_response(title, output, reprompt_text, should_end_session):
    return {
        'outputSpeech': {
            'type': 'PlainText',
            'text': output
        },
        'card': {
            'type': 'Simple',
            'title': "SessionSpeechlet - " + title,
            'content': "SessionSpeechlet - " + output
        },
        'reprompt': {
            'outputSpeech': {
                'type': 'PlainText',
                'text': reprompt_text
            }
        },
        'shouldEndSession': should_end_session
    }


def build_response(session_attributes, speechlet_response):
    return {
        'version': '1.0',
        'sessionAttributes': session_attributes,
        'response': speechlet_response
    }


# --------------- Functions that control the skill's behavior ------------------

def get_welcome_response():
    """ If we wanted to initialize the session to have some attributes we could
    add those here
    """

    session_attributes = {}
    card_title = "Welcome"
    speech_output = "Welcome to the Weekend killer. " \
                    "Please tell me your destination, "
    # If the user either does not reply to the welcome message or says something
    # that is not understood, they will be prompted again with this text.

    reprompt_text = "Please tell me your destination by saying, " \
                    "my destination is ."
    should_end_session = False
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def handle_session_end_request():
    card_title = "Session Ended"
    speech_output = "Thank you for trying the Alexa Skills Kit sample. " \
                    "Have a nice day! "
    # Setting this to true ends the session and exits the skill.
    should_end_session = True
    return build_response({}, build_speechlet_response(
        card_title, speech_output, None, should_end_session))



def set_destination(intent,session):
    card_title = intent['name']
    session_attributes={}
    should_end_session=False
    destination_count=0
    if 'Destination' in intent['slots']:
        print (intent['slots']['Destination'])
        if not 'value' in intent['slots']['Destination']:
            speech_output="I'm not sure what your destination is. Please try again."
            reprompt_text="I'm not sure what your destination is. Please try again."
            return build_response(session_attributes, build_speechlet_response(
                intent['name'], speech_output, reprompt_text, should_end_session))

        destination=intent['slots']['Destination']['value']
        print ("destination is "+destination)
        if destination == "done" or destination == "finished" or destination == "no" or destination == "stop":
            print ("branch done")
            if not session.get('attributes', {}) or not "Destination_count" in session.get('attributes', {}):
                speech_output="Oops You are not going anywhere. Please try."
                reprompt_text="Oops You are not going anywhere. Please try."
            else:
                should_end_session=True
                destination_count=session['attributes']['Destination_count']
                reprompt_text=None
                request_place=[]
                for x in range(1,destination_count+1):
                    key="Destination"+str(x)
                    request_place.append(session['attributes'][key])
                print (request_place)
                post_request={"locations":request_place}
                headers = {'content-type' : 'application/json'}
                r=requests.post(server_api,params=post_request,headers=headers)

                # r = requests.get(server_api)
                locations = r.json()["locations"]
                total_time=r.json()["duration"]
                speech_output="This is the path I suggest: First go to "
                for x in locations:
                    key="Destination"+str(x)
                    tmp= x+", then go to "
                    speech_output+=tmp
                speech_output+=", then go home"
                
                speech_output+=", the total drive time is" +str(total_time)+"minutes. Have a good day"



        else:
            if not destination=="supermarket" and not destination=="restaurant" and not destination=="movie":
                speech_output="Please say supermarket or restaurant or movie."
                reprompt_text="Please say supermarket or restaurant or movie."
                return build_response(session_attributes, build_speechlet_response(
                    intent['name'], speech_output, reprompt_text, should_end_session))

            print ("branch2")
            if session.get('attributes', {}) and "Destination_count" in session.get('attributes', {}):
                destination_count=session['attributes']['Destination_count']
                session_attributes=session['attributes']

            key="Destination"+str(destination_count+1)
            session_attributes["Destination_count"]=destination_count+1
            session_attributes[key]=destination
            speech_output="Your next destination is "+ destination+\
                            ",do you plan to go somewhere else?"
            reprompt_text="Your next destination is "+ destination+\
                            ",do you plan to go somewhere else?"

    else:
        speech_output="I'm not sure what your destination is. Please try again."
        reprompt_text="I'm not sure what your destination is. Please try again."
    print (session_attributes)
    return build_response(session_attributes, build_speechlet_response(
        intent['name'], speech_output, reprompt_text, should_end_session))


# --------------- Events ------------------

def on_session_started(session_started_request, session):
    """ Called when the session starts """

    print("on_session_started requestId=" + session_started_request['requestId']
          + ", sessionId=" + session['sessionId'])


def on_launch(launch_request, session):
    """ Called when the user launches the skill without specifying what they
    want
    """

    print("on_launch requestId=" + launch_request['requestId'] +
          ", sessionId=" + session['sessionId'])
    # Dispatch to your skill's launch
    return get_welcome_response()


def on_intent(intent_request, session):
    """ Called when the user specifies an intent for this skill """

    print("on_intent requestId=" + intent_request['requestId'] +
          ", sessionId=" + session['sessionId'])

    intent = intent_request['intent']
    intent_name = intent_request['intent']['name']

    # Dispatch to your skill's intent handlers
    if intent_name=="SetDestinationIntent":
        return set_destination(intent,session)
    elif intent_name == "AMAZON.HelpIntent":
        return get_welcome_response()
    elif intent_name == "AMAZON.CancelIntent" or intent_name == "AMAZON.StopIntent":
        return handle_session_end_request()
    else:
        raise ValueError("Invalid intent")


def on_session_ended(session_ended_request, session):
    """ Called when the user ends the session.

    Is not called when the skill returns should_end_session=true
    """
    print("on_session_ended requestId=" + session_ended_request['requestId'] +
          ", sessionId=" + session['sessionId'])
    # add cleanup logic here


# --------------- Main handler ------------------

def lambda_handler(event, context):
    """ Route the incoming request based on type (LaunchRequest, IntentRequest,
    etc.) The JSON body of the request is provided in the event parameter.
    """
    print("event.session.application.applicationId=" +
          event['session']['application']['applicationId'])

    """
    Uncomment this if statement and populate with your skill's application ID to
    prevent someone else from configuring a skill that sends requests to this
    function.
    """
    # if (event['session']['application']['applicationId'] !=
    #         "amzn1.echo-sdk-ams.app.[unique-value-here]"):
    #     raise ValueError("Invalid Application ID")

    if event['session']['new']:
        on_session_started({'requestId': event['request']['requestId']},
                           event['session'])

    if event['request']['type'] == "LaunchRequest":
        return on_launch(event['request'], event['session'])
    elif event['request']['type'] == "IntentRequest":
        return on_intent(event['request'], event['session'])
    elif event['request']['type'] == "SessionEndedRequest":
        return on_session_ended(event['request'], event['session'])


