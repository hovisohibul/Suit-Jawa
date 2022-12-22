// deklarasi variabel dengan value
const moves = document.getElementById('moves-count')
const timer = document.getElementById('times')
const stopButton = document.getElementById('stop')
const startButton = document.getElementById('start')
const gameBoard = document.querySelector('.game-container')
const result = document.getElementById('result')
const controls = document.querySelector('.control-container')

// deklarasi variable tanpa value
let card
let interval
let firstCard = false
let secondCard = false

// data array
const items = [
    {name: 'zoro', image: './assets/zoro.png'},
    {name: 'luffy', image: './assets/luffy.png'},
    {name: 'jennie', image: './assets/jennie.png'},
    {name: 'irene', image: './assets/irene.png'},
    {name: 'dragneel', image: './assets/dragneel.png'},
    {name: 'saitama', image: './assets/saitama.png'},
    {name: 'dragon', image: './assets/dragon.png'},
    {name: 'kimetsu', image: './assets/kimetsu.png'},
    {name: 'noragami', image: './assets/noragami.png'},
    {name: 'strange', image: './assets/strange.png'},
    {name: 'transformer', image: './assets/transformer.png'},
    {name: 'venom', image: './assets/venom.png'},
]

// waktu awal
let seconds = 0,
    minute = 0

// awal gerak dan win count
let movesCount = 0,
winCount = 0

// untuk timer
const  timeGenerator = () => {

    // menambahkan detik 
    seconds += 1

    // second diubah menjadi minute 
    if(seconds >= 60){
        minute += 1 
        seconds = 0
    }

    // format waktu dengan 4 digit
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds
    let minuteValue = minute < 10 ? `0${minute}` : minute

    // masukan value waktu kedalam timer
    timer.innerHTML = `<span>Time: </span>${minuteValue} : ${secondsValue}`
}

// untuk menghitung gerakan
const movesCalculate = () => {

    // movesCount menambah setiap bergerak
    movesCount += 1

    // tampilkan moves kedalam html
    moves.innerHTML = `<span>Moves: </span>${movesCount}`
}

// random item dari item array
const generateRandom = (size = 4) => {

    // array sementara
    /*
        maksud array sementara dengan spread operator, agar data pada variable item tidak terkikis secara permanent
        saat melakukan splice
    */ 
    const tempArray = [...items]

    // menginisialisasi value kartu array
    let cardValues = []

    // ukuran harus ganda ((4 * 4 matriks) / 2) karena pasangan objek akan ada
    size = (size * size) / 2

    // seleksi secara acak
    for(let i = 0; i < size; i++){

        // mencari index dari panjang array sementara
        const randomIndex = Math.floor(Math.random() * tempArray.length) 
        
        // masukan index acak yang ada di array sementara ke cardValue
        cardValues.push(tempArray[randomIndex])

        // saat dipilih akan menghapus objek dari array sementara
        tempArray.splice(randomIndex, 1)
    }

    return cardValues
}

// untuk matriks kartu
const  matrixGenerator = (cardValues, size = 4) => {

    // memastikan agar game container bersih
    gameBoard.innerHTML = ''
    cardValues = [...cardValues, ...cardValues];

    // simple shuffle posisi kartu  
    cardValues.sort(() => Math.random() - 0.5)

    // mencari nilai dari ukuran matrix
    for(let i = 0; i < size * size; i++){

        /*
            membuat kartu
            bagian belakang => tampilan depan (berisi tanda tanya)
            bagian depan => tampilan belakang (berisi gambar yang dipilih)
            data-card-values adalah atribut khusus yang menyimpan nama kartu untuk dicocokkan nanti
        */ 
        gameBoard.innerHTML += `
            <div class="card-container" data-card-values="${cardValues[i].name}">
                <div class="card-before">?</div>
                <div class="card-after">
                    <img src="${cardValues[i].image}" class="image">
                </div>
            </div>
        `
    }

    // grid
    gameBoard.style.gridTemplateColumns = `repeat(${size}, auto)`

    // card
    card = document.querySelectorAll('.card-container')
    card.forEach((cards) => {
        
        // event click
        cards.addEventListener('click', () => {

            /*
                jika kartu yang dipilih belum cocok maka jalankan saja (yaitu kartu yang sudah cocok saat diklik akan diabaikan) 
            */
           if(!cards.classList.contains('matched')){

                // flipped the card
                cards.classList.add('flipped')

                // jika itu adalah kartu pertama (! kartu pertama karena kartu pertama awalnya salah)
                if(!firstCard){

                    // jadi kartu saat ini akan menjadi kartu pertama
                    firstCard = cards

                    // nilai kartu saat ini menjadi nilai kartu pertama
                    firstCardValue = cards.getAttribute('data-card-values')
                }else{

                    // menaikkan gerak sejak pengguna memilih kartu kedua
                    movesCalculate()
    
                    // jadi kartu saat ini akan menjadi kartu pertama
                    secondCard = cards
                    let secondCardValue = cards.getAttribute('data-card-values')
    
                    // jika nilai kartu pertama sama dengan kedua
                    if(firstCardValue == secondCardValue){
                        firstCard.classList.add('matched')
                        secondCard.classList.add('matched')
    
                        // setel kartu pertama ke false karena kartu berikutnya akan menjadi yang pertama sekarang
                        firstCard = false
                        
                        // menaikan jumlah kemenangkan pengguna menemukan kecocokan yang tepat
                        winCount += 1
    
                        // mengecek jika jumlah menang sama seperti nilai kartu yang setengah
                        if(winCount == Math.floor(cardValues.length / 2)){
                            result.innerHTML = `
                                <h2>You Won</h2>
                                <h4>Your Moves: ${movesCount}</h4>
                            `
                            stopGame()
                        }
                    }else{
    
                        // jika kartu tidak cocok
                        // balik kartu seperti normal
                        let [tempFirst, tempSecond] = [firstCard, secondCard]
                        firstCard = false
                        secondCard = false
    
                        // balik kartu
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove('flipped')
                            tempSecond.classList.remove('flipped')
                        }, 1000)
                    }
                }
            }
        })
    })
}


// menginisialisasi nilai dan pemanggilan function
const initializer = () => {

    // membersihkan tag result agar tidak terjadi pengulangan 
    result.innerHTML = ''

    winCount = 0

    // buat variable dengan nilai fungsi generateRandom
    let cardValue = generateRandom()

    console.log(cardValue)

    // panggil fungsi matriks
    matrixGenerator(cardValue)
}

// start game
startButton.addEventListener('click', () => {
    
    movesCount = 0
    time = 0

    // controls dan button visibility
    controls.classList.add('hide')
    stopButton.classList.remove('hide')
    startButton.classList.add('hide')

    interval = setInterval(timeGenerator, 1000)

    moves.innerHTML = `<span>Moves:</span> ${movesCount}`
    initializer()
})

stopButton.addEventListener('click', (stopGame = () => {
        controls.classList.remove('hide')
        stopButton.classList.add('hide')
        startButton.classList.remove('hide')
        clearInterval(interval)
    })
)