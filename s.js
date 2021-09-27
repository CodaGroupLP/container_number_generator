


const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '1234567890'
let validator = new ContainerValidator()
let txtPrefix = document.getElementById("txtPrefix")
let alertPlaceholder = document.getElementById('liveAlertPlaceholder')
let mySpinner = document.querySelector('.my-spinner')
let txtContainerList = document.getElementById('txtContainerList')

chrome.storage.sync.get(['container_numbers'], (result) => {
    txtContainerList.value = result.container_numbers.toLocaleString().replaceAll(',','\n')
})


function _randomContainerNumber(){
    let result = txtPrefix.value + '';
   
    const regex = /[^A-Z]/g;
    
    if (result.toLocaleUpperCase().match(regex)){
        throw new Error("You entered non-letter on Prefix")
    }

    //letters
    if(result.length < 3){
        let length = 3 - result.length
        for ( var i = 0; i < length; i++ ) {
            result += letters.charAt(Math.floor(Math.random() * 
        letters.length));
        }
    }      

    result += 'U' //adding U to 4th string (U - frieght containers)

    //numbers
    for ( var i = 0; i < 6; i++ ) {
        result += numbers.charAt(Math.floor(Math.random() * 
        numbers.length));
    }

   return result.toUpperCase();
}

function generateContainerNumber() {
    let result = ''
    while (true) {
        let random = _randomContainerNumber()
        if(validator.createCheckDigit(random) >= 2){
            result = random + validator.createCheckDigit(random)
            break
        }
    }

    return result
}


function generateContainerButtonFunc(numbers) {
    let result = []

    for (let i = 0; i < numbers; i++) {
        result.push(generateContainerNumber())
    }

    chrome.storage.sync.set({'container_numbers': result})
    return result
}

function alert(message, type) {
    let wrapper = document.createElement('div')
    wrapper.innerHTML = `<div class="alert col-sm alert-${type} alert-dismissible" role="alert">
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    <p>${message}</p>               
</div>`
  
    alertPlaceholder.append(wrapper)
  }

function spinner() {
    let wrapper = document.createElement('div')
    wrapper.innerHTML = `<div class="text-center" id="spinner">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>`

    mySpinner.append(wrapper)
    
}

const btnGenerate = document.querySelector('#btnGenerate')

// btnGenerate.onclick = () => {
//     try{
//         document.getElementById('txtContainerList').value = ''
//         mySpinner.style.display = 'block'
//         document.getElementById('txtContainerList').value = generateContainerButtonFunc(parseInt(document.getElementById("txtNumber").value)).toLocaleString().replaceAll(',','\n')
       
            
        
//     }catch (error){
//         console.error(error)
//         alert(`Oopsie!. ${error.message}`, 'danger')
//     }finally{
//         mySpinner.style.display = 'none';
//     }
// }

let generate = async () => {

    let response =  await generateContainerButtonFunc(parseInt(document.getElementById("txtNumber").value)).toLocaleString().replaceAll(',','\n')
    if (response) {
        return response;
      } else {
        throw new Error("the hell");
      }
}

btnGenerate.onclick = () => {
    document.getElementById('txtContainerList').value = ''
    mySpinner.style.display = 'block';
    generate()
        .then((resp) => {
            document.getElementById('txtContainerList').value = resp
        })
        .catch((error) => {
            //console.error(error)
            alert(`Oopsie!. ${error.message}`, 'danger')
        })
        .finally(() => {
            mySpinner.style.display = 'none';
        })
}

document.getElementById('btnClear').onclick = () => {
    document.querySelector("input[type='number']").value = 1;
    document.getElementById('txtContainerList').value = ''
    txtPrefix.value = '';
    chrome.storage.sync.set({'container_numbers': []})
}
