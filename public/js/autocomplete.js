function autoComplete(inputEl, getDataFn, callback){

    inputEl.addEventListener("keyup", async function(e){
        


        if(e.which == 40 || e.which == 38 || e.which == 13){
            e.preventDefault();


            let ul = document.querySelector("#list-autocomplete");
            
            if(ul){
                let currentSelected = ul.querySelector(".selected");

                if(e.which == 40){ //arrow down

                    if(currentSelected){

                        if(ul.lastChild.classList.contains("selected")){
                            
                            ul.lastChild.classList.remove("selected");
                            
                            currentSelected = ul.firstChild;    
                            
                        }
                        
                        else{
                            
                            currentSelected.classList.remove("selected");
                            
                            currentSelected = currentSelected.nextElementSibling;
                        }

                    }
                    else{
                        
                        currentSelected = ul.firstChild;

                    }
                    
                    currentSelected.classList.add("selected");

                    inputEl.value = currentSelected.textContent;
                }
                else if(e.which == 38){ //arrow up
                    if(currentSelected){

                        if(ul.firstChild.classList.contains("selected")){
                            
                            ul.firstChild.classList.remove("selected");
                              
                            currentSelected = ul.lastChild;
                        
                        }
                        else{
                            currentSelected.classList.remove("selected");

                            currentSelected = currentSelected.previousElementSibling;
                           
                        }
                        
                        
                    }
                    else{
                        currentSelected = ul.lastChild;
                    }

                    currentSelected.classList.add("selected");

                    inputEl.value = currentSelected.textContent;
                }
                else if(e.which == 13){

                    currentSelected.click();
                    
                    
                }

            }
            
            
            return;
        }
        

        //let searchedData = data.filter(item => item.toLowerCase().indexOf(inputEl.value.toLowerCase()) >= 0 && inputEl.value != "");
        let searchedData = await getDataFn(inputEl.value);

        if(searchedData.length > 0){
          
            if(document.querySelector("#list-autocomplete")){
                document.querySelector("#list-autocomplete").remove();
            }
            
            let ul = document.createElement("UL");
            ul.setAttribute("id", "list-autocomplete");
            ul.classList.add("search-suggestion-list");
            
            searchedData.forEach((item) =>{

                let li = document.createElement("LI");

                li.addEventListener("click", function(){

                    inputEl.value = item;
                    ul.remove();

                    callback(item);
                    
                });

                li.textContent = item;

                ul.appendChild(li);
    
            });

            insertAfter(ul, inputEl);
           
           
        }
        else{
            
            if(document.querySelector("#list-autocomplete")){
                document.querySelector("#list-autocomplete").remove();
            }
            
        }
        
    });

    
    function insertAfter(newNode, refNode ){

        refNode.parentNode.insertBefore(newNode, refNode.nextSibling);

    }
   

}