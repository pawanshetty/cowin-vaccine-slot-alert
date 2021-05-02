
const http = require('http');
const axios = require('axios')
const cron = require('node-cron');
const url = require('url');
const nodemailer = require('nodemailer');
let aws = require("@aws-sdk/client-ses");

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: ''
  },
  pool:true
});

const hostname = '127.0.0.1';
const port = 3000;

const DISTRICT_IDS = [
    294, 
    265
]

const DATES = ["02-05-2021", "09-05-2021", "16-05-2021", "23-05-2021"]

const URL = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict"

const server = http.createServer((req, res) => {
  res.statusCode = 200;
});

var count = 0;


server.listen(port, hostname, () => {

  cron.schedule('* * * * *', function() {
    checkCowin()
  })
});

function checkCowin() {

  // console.log(`Server running at http://${hostname}:${port}/`);

  DISTRICT_IDS.forEach(district => {
     DATES.forEach(date => {

        axios
        .get(URL, {
          params : {
            'district_id' : url.format(district.toString()),
            'date' : url.format(date.toString())
          }
        })
        .then(res => {
          res.data.centers.forEach(center => 
          {
              center.sessions.forEach(session => {
                if (session.min_age_limit == 18 && session.available_capacity > 0) {

                  var mailDetails = {
                    from: 'your SMTP mail',
                    to: 'to-email',
                    subject: 'Availability mail - Book soon',
                    html:" <b>Slot open at"+center.name+" on" + session.date +"</b><br> "
                     + "District -"+center.district_name+" pincode  "+center.pincode 
                     +" <br> <b>Added/Available Capacity:"
                     +session.available_capacity+"</b><br> <p> If the added capacity is 1, the slot might be booked sooner. </p>"
                  };
                
                  transporter.sendMail(mailDetails, function(err, data) {
                    if(err) {
                      console.log(err)
                        console.log('Error Occurs');
                    } else {
                        console.log('Email sent successfully');
                    }
                  });

                }
              }
            )
          })
        })
        .catch(error => {
          // console.error(error)
        })
     })
  
  })

}