import xapi from 'xapi';

// VARIABLES
const performCheckTimer = 5000 // run script every (msec)
const alertCounter = 5    // intervals of performCheckTimer
const releaseCounter = 10  // intervals of performCheckTimer

var countPeopleLoop = 0
var currentPeopleCount = 0
var currentPeoplePresense = "No"
var meetingId

function timer() {
  setTimeout(timer, performCheckTimer);
  getBookings();
}

function getBookings(){
  console.log('getBookings...')
  xapi.command('Bookings List')
  .then((response) => {
    const bookings = response.Booking
    bookings.forEach(checkMeetingTime);
  })
}

function checkMeetingTime(item, index){
  const startTime = item.Time.StartTime
  meetingId = item.MeetingId

  var startEpochTime = convertTimeToEpoch(startTime)
  var currentEpochTime = getCurrentTime()

  if (currentEpochTime > startEpochTime){
    console.log('meeting ' + meetingId +' is active')
    getPeopleCount()
  }
}

function convertTimeToEpoch(dateTimeString){
  var timeDate = new Date(dateTimeString);
  var timeEpoch = timeDate.getTime();
  return timeEpoch
}

function getCurrentTime(){
  var d = new Date();
  var n = d.getTime();
  return n
}

function detectPeople(){
  console.log('currentPeopleCount: ', currentPeopleCount)
  console.log('currentPeoplePresence: ', currentPeoplePresense)
  if (currentPeopleCount == 0 && currentPeoplePresense == "No"){
          console.log('no show')
          countPeopleLoop++
          console.log('currentCheck: ', countPeopleLoop)
          if (countPeopleLoop >= releaseCounter){
            releaseRoom()
          }else if (countPeopleLoop >= alertCounter){
            presentWarning()
          }
        }else{
          console.log('meeting active')
        }
}

function getPeopleCount(){
  xapi.status
    .get('RoomAnalytics PeopleCount')
    .then((count) => {
      currentPeopleCount = count.Current
      getPeoplePresence()
    })
}

function getPeoplePresence(){
  xapi.status
    .get('RoomAnalytics PeoplePresence')
    .then((result) => {
      currentPeoplePresense = result
      detectPeople()
    })
}


function presentWarning(){
  xapi.command('UserInterface Message Prompt Display', {
    Title: "Warning",
    Text: "We have not detected anybody for this meeting. About to remove this room from the booking!",
    Duration: 5,
    FeedbackId: "cancelRoomBtn",
    'Option.1': "Cancel"
  });
}


function releaseRoom(){
  countPeopleLoop = 0
  console.log("releasingRoom!!!")
  // Code to come...
}


xapi.event.on('UserInterface Message Prompt Response', (event) => {
  if (event.FeedbackId !== 'cancelRoomBtn') return;
  console.log("User intervention")
  countPeopleLoop = 0
});


timer();
