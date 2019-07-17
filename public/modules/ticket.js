var network = require('./../../recycling_tracker/network.js');
var request = require('request');

exports.get_ticket_history_by_company_id = function(user_id,cb){
    console.log("get user ticket history");
    request.get({
      url : 'http://localhost:3000/api/queries/get_ticket_history'
      },async function(error,res,body){
        if(!error){
          var comptickets = JSON.parse(body);
          var my_ticket = []
          var temp = []
          var count = 0;
          //for(var i = 0; i< compassets.length; i++)
          await Promise.all(comptickets.map(async (file) =>{
            var event = file.eventsEmitted[0]
            if(event.ticket_id.split('.')[0] == user_id){
              temp.push(event);
            }
          }))
          console.log("ticket history : ",temp)
          if(temp.length == 0 ) {
              cb(true,my_ticket);
            }
          else{
          await Promise.all(temp.map(async (ticket) =>{
            //(asset_id,gen_weight, handle_weight, save_weight
            var transaction_type = ticket.$class.split('.')[3];
            if(transaction_type == "ticket_created"){
              transaction_type = "생성"
            }
            else if(transaction_type == "ticket_updated"){
              transaction_type = "수정"
            }
            else{
                transaction_type = "삭제"
            }
            var ticket_id = ticket.ticket_id;
            var waste_code = ticket.ticket_id.split(".")[1]
            var currentdes=ticket.currentdes;
            var previousdes=ticket.previousdes;
            var transfer_date=ticket.transfer_date;
            var weight=ticket.weight;
            var giver_id = ticket.giver.split('#')[1];
            var reciever_id = ticket.reciever.split('#')[1];
            var conveyancer_id = ticket.conveyancer.split('#')[1];
            var timestamp = ticket.timestamp
            var sqlquery = "SELECT * FROM users WHERE user_id=?";
            connection.query(sqlquery,giver_id,function (err, row) {
              if (err) {
                console.log("no match");
                cb(false, []);
              } else {
                console.log("found giver name");
                var giver_name = row[0].user_name
                connection.query(sqlquery,reciever_id,function (err, row) {
                if (err) {
                    console.log("no match");
                    cb(false, []);
                } else {
                    console.log("found reciever name");
                    var reciever_name = row[0].user_name
                    connection.query(sqlquery,conveyancer_id,function (err, row) {
                        if (err) {
                            console.log("no match");
                            cb(false, []);
                        } else {
                            console.log("found conveyancer name");
                            var conveyancer_name = row[0].user_name
                            var compticket = {
                                ticket_id: ticket_id,
                                waste_code : waste_code,
                                currentdes: currentdes,
                                previousdes:previousdes,
                                transfer_date: transfer_date,
                                weight: weight,
                                timestamp: timestamp,
                                giver: giver_name,
                                reciever: reciever_name,
                                conveyancer : conveyancer_name
                              }
                              console.log(compticket);
                              my_ticket.push(compticket)
                              count++;
                              if(count == temp.length){
                                console.log("my_ticket : ",my_ticket);
                                cb(true,my_ticket);
                              }
                        }
                        });
                }
                });
            }
          });
          }))
        }
    }
        else{
          cb(false, []);
        }
    })
  }