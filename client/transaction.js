/**
 * Created by arun on 2/6/17.
 */


var web3 = new Web3(new Web3.providers.HttpProvider("http://52.221.196.218:8545"));

function getAccounts(callBack) {
    web3.eth.getAccounts(function (error,result) {
       if(error){
           callBack (false);
       }
       else
       {
           callBack( result);
       }
    });
}

function getMerchantAccounts(callBack) {
    var Maccounts = [];
    web3.eth.getAccounts(function (error,result) {
        if(error){
            callBack (false);
        }
        else
        {
            var account1 = {
              name : 'Merchant 1',
              accountNo : result[0]
            };
            var account2 = {
              name : 'Merchant 2',
              accountNo : result[1]
            };
            Maccounts.push(account1,account2)
            callBack( Maccounts);
        }
    });
}


function getBalance(address,callBack) {

    web3.eth.getBalance(address,function (error,result) {
       if(error){
           callBack(false);
       }
       else
       {
           callBack(web3.fromWei(result, 'ether'));
       }
    });

}

function send(from, to,value,callBack) {

    var transactionObject = {
        from : from,
        to : to,
        value : web3.toWei(value,'ether'),
        gasPrice : web3.toWei(0.0000001, 'ether')
    };

    web3.eth.sendTransaction(transactionObject ,function (error,result) { console.log(result,error)
       callBack(result);
    });


}


// getMerchantAccounts(function (resuly) {
//     console.log(resuly)
// });
//
// getBalance("0x8b16a121e5313a112c4f3af435671d629a367a79",function (result) {
//    console.log("1",result)
// });
//
// getBalance("0x9e5816f4ef8807ae6813488118ad225b3ba4f41d",function (result) {
//    console.log("before",result.toNumber())
// });
//
//
// send("0x8b16a121e5313a112c4f3af435671d629a367a79",
//     "0x9e5816f4ef8807ae6813488118ad225b3ba4f41d",
//     1,function (result) {
//         console.log("dummy trans",result)
//         getBalance("0x9e5816f4ef8807ae6813488118ad225b3ba4f41d",function (result) {
//             console.log("2",result.toNumber())
//         });
//     }
// )



