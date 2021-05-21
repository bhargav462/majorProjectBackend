const SMSUser = require('./../../models/UserModels/SMSUser')
const Products = require('./../../models/product')
const sharp = require('sharp')
const fs = require('fs')

module.exports.register = async (message) => {
    console.log("SMS Register",message)

    try{
        if(message.length != 3){
            return "Insufficient Arguments!"
        }
    
        const number = message[0]
        const name = message[1] + message[2]

        var phonenoRegex = /^\d{10}$/;

        if(!number.match(phonenoRegex)){
            return 'Invalid Phone number'
        }
    
        const smsUser = new SMSUser({mobile: number, name})
        await smsUser.save()
    
        return "Registered Successfully"
    }catch(e){
        console.log("error",e)
        try{
            const user = await SMSUser.findOne({mobile: message[0]})
            console.log("user",user)
            if(user){
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
        return "Invalid arguments. Error from description argument. Valid format is keyword number crop weight price /description/ /address/ pincode"
        
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
        return "Invalid arguments. Error from address argument. Valid format is keyword number crop weight price /description/ /address/ pincode"
        
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

            return "Crop Added Successfully"

    }catch(e){
        console.log("error log",e)
        return "Invalid Arguments. Valid format is keyword number crop weight price /description/ /address/ pincode"
    }

    return "Crop Added Successfully"
}

module.exports.updateCrop = () => {

}

module.exports.deleteCrop = () => {

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