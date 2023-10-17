window.onload = init;
let cell_array = new Array();
let last_number = 0;
let bussy = false;

function init()
{
    tableboard();
    wheel();
}

function tableboard() 
{
    const table = document.getElementById("tableboard");

    for(i=36; i>=0; i--) 
    {
        const cell = create_cell("cell " + (i==0? "green" : (i%2==0 ? "black" : "red")));
        const text = document.createElement('span');
        text.setAttribute("class", "rotated");
        text.innerHTML = i;
        cell.number = i;
        cell.prepend(text);
    }

    cell_array = cell_array.reverse()

    create_cell("cell special red").append("RED");
    create_cell("cell special black").append("BLACK");
    create_cell("cell special maj").append("19-36");
    create_cell("cell special min").append("1-18");

    function create_cell(class_name)
    {
        const cell = document.createElement('div');
        cell.setAttribute("class", class_name);
        table.appendChild(cell);

        const bet = document.createElement('div');
        bet.setAttribute("class", "bet null");
        bet.innerHTML = 0;

        cell.bet = bet;
        cell.appendChild(bet);
        cell.addEventListener("click", do_bet, false);
        cell_array.push(cell);

        return cell;
    }
}

function wheel()
{
    const wheel = document.getElementById("wheel");
    const array = new Array();
    const n = 37;
    const delta_angle = 360/n;
    let angle = 0;
    
    for(let i=0; i<37; i++)
    {
        const number = document.createElement("div");
        array.push(number);
        number.setAttribute("class", "number " + (i==0? "green" : (i%2==0? "black  " : "red " )));
        number.style.transform = "rotate("+angle+"deg) translate(600%)";
        angle+=delta_angle;

        const text = document.createElement("span");
        text.innerHTML = i;
        text.setAttribute("class", "number text");
        number.appendChild(text);
        wheel.append(number);
    }

    const button = document.getElementById("roll");
    button.addEventListener("click", roll);

    function spin()
    {
        array[last_number].classList.remove("light");
        last_number = Math.floor(Math.random()*36)
        array[last_number].classList.add("light");

        setTimeout(function(){wheel.style.animation="spin 3s forwards"}, 10);
        wheel.style.animation = "";
        return last_number;
    }

    function light_up(n)
    {
        cell_array[n].classList.add("light");
        if(n!=0)
        {
            if(n%2==0)
                cell_array[38].classList.add("light");
            else 
                cell_array[37].classList.add("light");
            if(n<19)
                cell_array[40].classList.add("light");
            else
                cell_array[39].classList.add("light");
        }
    }

    function blow_coins()
    {
        const coins = document.getElementsByClassName("bet");

        for (let i = 0; i < coins.length; i++)
            coins[i].style.animation = "1s blow forwards";

        setTimeout(()=>{

            for (let i = 0; i < coins.length; i++)
            {
                coins[i].setAttribute("class", "bet null");
                coins[i].style.animation = "";
                coins[i].innerHTML = 0;
            }

            cell_array.forEach(cell => {
                cell.classList.remove("light");
            });

        }, 1000);
    }

    function pay()
    {
        const cells = document.getElementsByClassName("cell light");
        let stack = 0;
        for(let i=0; i<cells.length; i++) 
            stack += cells[i].bet.innerHTML * (Number.isInteger(cells[i].number) ? 36 : 2);

        console.log("Won " + stack + " coins.")
        bussy = false;
    }

    function roll()
    {
        if(bussy)
            return;
        bussy = true;

        const n = spin();
        
        setTimeout(()=>{light_up(n)}, 2200);
        setTimeout(()=>{blow_coins()}, 4000);
        setTimeout(()=>{pay()}, 5000);
    }
};

function do_bet(ev)
{
    if(bussy)
        return;

    const cell = ev.currentTarget;
    if((++cell.bet.innerHTML)==1)
        cell.bet.setAttribute("class", "bet");
}



