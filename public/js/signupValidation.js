
let profile = document.querySelector('#imgUpdate')
let inputFile = document.querySelector('#image')

inputFile.onchange = ()=>{
      profile.src = URL.createObjectURL(inputFile.files[0])
}

document.getElementById("signupForm").addEventListener('submit', (e) => {

    e.preventDefault();


    const form = e.target;
    const formData = new FormData(form);
    const result = document.getElementById("result");

    // Clear previous error message
       setTimeout(()=>{
        result.innerHTML = "";
       },5000)

    // Check for form validity
    if (!form.checkValidity()) {
        result.innerHTML = "Please fill out all required fields correctly!";
        return;

    }

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password').value.trim();
    const ConformPassword = form.querySelector('#ConformPassword').value.trim();
    // const image = form.querySelector('#image').value
       
    
    if (!name.match(/^[A-Za-z ]+$/)) {
        result.innerHTML = 'Name should contain only letters and spaces.';
        return;
    }

    if (!email.match(/^([a-zA-Z0-9_]+)@([a-zA-Z0-9]+)\.([a-zA-Z]+)(.[a-zA-Z]+)?$/)) {
        result.innerHTML = "Email should be correctly entered";
        return;
    }
    // if (password.match(/^(?=.*\d).{8,}$/)) {
    //     result.innerHTML = 'Password should be 8 digit'
    // }
    // if (!password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)) {
    //     result.innerHTML = ' at least one special character.';
    //     return;
    // }
    if (password != ConformPassword) {
        result.innerHTML = 'conform Password not Match';
        return;
    }
  console.log(formData);
  

    try {

        fetch('/registerUser', {
                method: 'POST',
                body: formData
            })
            .then(async (response) => {
                let data = await response.json();
                console.log(data);
                
                
                if (response.status === 200) {
                    result.style.color = 'green'
                    result.style.fontWeight = 'bold'

                    result.innerHTML = "Your signup is successfully completed. Please verify your email.";
                    setTimeout(()=>{
                        location.href = '/'
                    },2000)
                } else if(response.status === 301){
                    result.innerHTML = data.error;
                }else{
                    result.innerHTML = data.error;
                }
            })
            .catch(error => {
                result.innerHTML = "Something went wrong!";
                // result.innerHTML = error;
                console.error(error);
            })
    } catch (error) {
        result.innerHTML = 'fetch error'
    }
});