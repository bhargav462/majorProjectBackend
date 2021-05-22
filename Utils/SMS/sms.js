const SMSUser = require('./../../models/UserModels/SMSUser')
const Products = require('./../../models/product')
const sharp = require('sharp')
const fs = require('fs')
const { CustomerProfilesEntityAssignmentsPage } = require('twilio/lib/rest/trusthub/v1/customerProfiles/customerProfilesEntityAssignments')
const token = require('./../../token')

module.exports.register = async (message) => {
    console.log("SMS Register",message)

    try{
        if(message.length != 3){
            return "Insufficient Arguments!"
        }
    
        const number = message[0]
        const name = message[1] + " " + message[2]

        var phonenoRegex = /^\d{10}$/;

        if(!number.match(phonenoRegex)){
            return 'Invalid Phone number'
        }
    
        const smsUser = new SMSUser({mobile: number, name})
        await smsUser.save()
        
        sendSMS(number,"You are Registered Successfully")
        return "Registered Successfully"
    }catch(e){
        console.log("error",e)
        try{
            const user = await SMSUser.findOne({mobile: message[0]})
            console.log("user",user)
            if(user){
                sendSMS(user.mobile,"Already Registered")
                return "Already Registered"
            }
            return "Unexpected Error"
        }catch(e){
            console.log("second error",e)
            return "Unexpected Error"
        }
    }

}

module.exports.addCrop = async (message,user) => {

    try{

        console.log("addCrop",message)
        
        if(message.length < 7){
            return "Insufficient arguments. Valid format is keyword number crop weight price /description/ /address/ pincode"
        }

        const number = message[0]
        const crop = message[1]
        const weight = message[2]
        const price = message[3]
        message = message.slice(4)
        let index = 0;

        console.log("done1",message)
        
        if(message[0][0] != "/")
        {
            sendSMS(number,"Invalid arguments. Error from description argument. Valid format is keyword number crop weight price /description/ /address/ pincode")
            return "Invalid arguments. Error from description argument. Valid format is keyword number crop weight price /description/ /address/ pincode"
        }

        message[0] = message[0].slice(1)
        let description = message[0]

        if(message[0][message[0].length-1] !== '/')
        {
            message = message.slice(1)

            for(i of message){
                if(i[i.length-1] !== "/")
                description += i
                else{
                    description += i.substr(0,i.length-1)
                    break;
                }
                index++;
            }
        }else{
            description = description.substr(0,description.length-1)
        }
        index++;

        message = message.slice(index)
        index = 0;

        console.log("done2",message)
        
        if(message[0][0] != "/")
        {
            sendSMS(number,"Invalid arguments. Error from address argument. Valid format is keyword number crop weight price /description/ /address/ pincode")
            return "Invalid arguments. Error from address argument. Valid format is keyword number crop weight price /description/ /address/ pincode"
        }

        message[0] = message[0].slice(1)
        let address = message[0]

        if(message[0][message[0].length-1] !== "/")
        {
            message = message.slice(1)

            for(i of message){
                if(i[i.length-1] !== "/")
                address += i
                else{
                    address += i.substr(0,i.length-1)
                    break;
                }
                index++;
            }
        }else{
            address = address.substr(0,address.length-1)
        }
        index++;

        var pincodeRegex = /^\d{6}$/;

        const pincode = message[index];

        if(!pincode.match(pincodeRegex)){
            sendSMS(number,"Invalid Pincode. Valid format is keyword number crop weight price /description/ /address/ pincode")
            return "Invalid Pincode. Valid format is keyword number crop weight price /description/ /address/ pincode"
        }

        console.log("done3")
        
        const data = fs.readFileSync('./Utils/assets/nopreview.png')

        // console.log("error",err)
        console.log("data",data)

            const dataJson = {
                buffer: data
            }

            let images = []
            images.push(dataJson)

            const product = new Products()
            product.farmerId = user._id
            product.crop = crop
            product.address = address
            product.pincode = pincode
            product.price = price
            product.amount = weight
            product.description = description
            product.number = number
            product.images = images

            await product.save()

            console.log("product",product)
              
            sendSMS(number,`Your crop was added successfully and your crop Id is ${product._id}`)
            return `Crop Added Successfully ${product._id}`

    }catch(e){
        console.log("error log",e)
        return "Invalid Arguments. Valid format is keyword number crop weight price /description/ /address/ pincode"
    }

    // return "Crop Added Successfully"
}

module.exports.updateCrop = async (message,user) => {

    console.log("update",message)

    try{
       const number = message[0]
       const cropId = message[1]
       message = message.slice(2)

       const product = await Products.findOne({_id: cropId, farmerId: user._id})

       for(let i = 0; i < message.length; i++)
       {
           if(i+1 < message.length){        
              
              if(message[i] === "description"){
                
                console.log("in",message[i])
                if(message[i+1][0] !== "/")
                {
                    sendSMS(number,"Error from description argument. Valid format is keyword number cropId weight weight price price description /description/ address /address/ pincode /pincode/. No need to add all the arguments. Please add the arguments only that you want to update")
                    return "Invalid arguments. Error from address argument. Valid format is keyword number crop weight price /description/ /address/ pincode"
                }
                i++;
                message[i] = message[i].slice(1)
                let value = message[i]

                if(message[i][message[i].length-1] !== "/")
                {
                    for(let m=i+1; m < message.length; m++){
                        if(message[m][message[m].length-1] !== "/")
                        value += " " + message[m]
                        else{
                            value += " " + message[m].substr(0,message[m].length-1)
                            break;
                        }
                        i++;
                        console.log("i",i)
                    }
                }else{
                    value = value.substr(0,value.length-1)
                }
                i++;

                product["description"] = value
                await product.save()
                
                sendSMS(number,`Description was updated successfully for cropId ${product._id}`)
                
              }else if(message[i] === "address"){
                
                if(message[i+1][0] !== "/")
                {
                    sendSMS(number,"Error from address argument. Valid format is keyword number cropId weight weight price price description /description/ address /address/ pincode /pincode/. No need to add all the arguments. Please add the arguments only that you want to update")
                    return "Invalid arguments. Error from address argument. Valid format is keyword number crop weight price /description/ /address/ pincode"
                }
                i++;
                message[i] = message[i].slice(1)
                let value = message[i]

                if(message[i][message[i].length-1] !== "/")
                {
                    for(let m=i+1; m < message.length; m++){
                        if(message[m][message[m].length-1] !== "/")
                        value += " " + message[m]
                        else{
                            value += " " + message[m].substr(0,message[m].length-1)
                            break;
                        }
                        i++;
                    }
                }else{
                    value = value.substr(0,value.length-1)
                }
                i++;

                product["address"] = value
                await product.save()

                sendSMS(number,`Address was updated successfully for cropId ${product._id}`)

              }else{
                  if((message[i] in product) === false){
                    sendSMS(number,`Invalid ${message[i]} argument. Valid format is keyword number cropId weight weight price price description /description/ address /address/ pincode /pincode/. No need to add all the arguments. Please add the arguments only that you want to update`)
                    return `Invalid ${message[i]} argument. Valid format is keyword number cropId weight weight price price description /description/ address /address/ pincode /pincode/. No need to add all the arguments. Please add the arguments only that you want to update`
                  }

                  product[message[i]] = message[i+1];
                  await product.save()

                  sendSMS(number,`${message[i]} was updated successfully for cropId ${product._id}`)

                  i++;
              }

              console.log("product",product)
              
           }else{
               return `Invalid argument: ${message[i]}`
           }
       }

       return "Crop was Updated Successfully"

    }catch(e){
       console.log("error",e)
       return "Unexpected Error"
    }

}

module.exports.deleteCrop = async (message,user) => {

    try{
        if(message.length != 2)
            return "Invalid Arguments"

        const number = message[0]
        const cropId = message[1]

        const product = await Products.findOne({_id:cropId,farmerId:user._id})
        await product.delete()

        console.log("product",product)

        return "Deleted Successfully"
    }catch(e){
        console.log("error",e)
        return "Unexpected error"
    }

}

const sendSMS = (number,body) => {

    console.log("body",body)

    const accountSid = process.env.TWILIO_SID
    const authToken = process.env.TWILIO_TOKEN || token.token

    console.log("authtoken",authToken)

    const client = require('twilio')(accountSid,authToken)

    client.messages.create({
        to: `+91${number}`,
        from: '+19104691435',
        body: body
    }).then((message) => console.log("message"))
    .catch(error => console.log("error",error))

}

// REGISTER
// keyword number firstName secondName

// ADD CROP
// keyword number crop weight price /description/ /address/ pincode

// UPDATE CROP
// keyword number cropId 
// weight weight
// price price
// description /description/
// address /address/
// pincode /pincode/

// DELETE CROP
// keyword number cropId

