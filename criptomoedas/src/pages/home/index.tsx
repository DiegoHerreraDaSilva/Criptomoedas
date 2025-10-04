import { useState , type FormEvent, useEffect} from 'react'
import styles from './home.module.css'
import {BsSearch} from 'react-icons/bs'
import {Link, useNavigate} from 'react-router'

export interface CoinProps{
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string;
  formatedPrice?: string; // ? torna opcional
  formatedMarket?: string;
  formatedVolume?: string;
}

interface DataProp{
  data: CoinProps[]
}

export function Home() {

  const [input, setInput] = useState("");

  const [coins, setCoins] = useState<CoinProps[]>([]);

  const [offSet, setOffSet] = useState(0);

  // Pelo useEffect ela vai renderizar ao abrir a página
  useEffect(() => {
    getData();
  }, [offSet])

  // Essa funçao vai fazer a requisição HTTP para a API
  async function getData(){              // limit = quantos itens vai pegar // &offset = da onde vai começar
    fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offSet}&apiKey=d68e8f13270a694ef0041f10325f9674dedc33ae861837182597334414feea4a`)
    .then(response => response.json()) // fetch é uma promise então recebe .then que recebe response, e é transformado em .json
                                          // .json é uma promise também, recebendo .then
    .then((data: DataProp) => { // data vai armazenar o array da API
      const coinsData = data.data;

      // variável que armazena o formato de dolar
      const price = Intl.NumberFormat("en-US" ,{
        style: "currency",
        currency: "USD"
      })
      // variável que armazena o formato de dolar e compacta
      const priceCompact = Intl.NumberFormat("en-US" ,{
        style: "currency",
        currency: "USD",
        notation: "compact"
      })

      // variavel que percorre e armazena o array da API, e adiciona propriedades a cada objeto
      const formatedResult = coinsData.map((item) => {
        const formated = {
          ...item, // adicionar todos os objetos ja existentes
          formatedPrice: price.format(Number(item.priceUsd)), // Formata o preço da moeda em dolar
          formatedMarket: priceCompact.format(Number(item.marketCapUsd)), // Formata o preço de mercado em dolar e compacta o valor
          formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)) // Formata o volume em dolar e compacta o valor
        }

        return formated;
      })
      const listCoins = [...coins, ...formatedResult]

      setCoins(listCoins); // Altera o valor da useState "coins", para o resultado formatado
    })
  }

  const navigate = useNavigate();

  function handleSubmit(e: FormEvent){
    e.preventDefault(); //  Previni de recarregar a pagina
    
    if(input === '') return;
    navigate(`/detail/${input}`)
  }

  function handleGetMore(){
    if(offSet === 0){
      setOffSet(10);
      return;
    }

    setOffSet(offSet + 10)

  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>

        <input 
        type="text" 
        placeholder='Digite o nome da moeda... EX bitcoin'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        />

        <button type='submit'>
          <BsSearch size={30} color="#FFF"></BsSearch>
        </button>

      </form>

      <table>
        <thead>
          <tr>
            <th scope='col'>Moeda</th>
            <th scope='col'>Valor de Mercado</th>
            <th scope='col'>Preço</th>
            <th scope='col'>Volume</th>
            <th scope='col'>Mudança 24h</th>
          </tr>
        </thead>

        <tbody id='tbody'>
          
          {coins.length > 0 && coins.map((item) => (
          <tr className={styles.tr} key={item.id}>

            <td className={styles.tdLabel} data-label="Moeda">

              <div className={styles.name}>
                <img 
                className={styles.logo}
                src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`} 
                alt="Logo Cripto" />

                <Link to={`/detail/${item.id}`}>
                  <span>{item.name}</span> | {item.symbol}
                </Link>

              </div>

            </td>

            <td className={styles.tdLabel} data-label="Valor Mercado">
              {item.formatedMarket}
            </td>

            <td className={styles.tdLabel} data-label="Preço">
              {item.formatedPrice}
            </td>

            <td className={styles.tdLabel} data-label="Volume">
              {item.formatedVolume}
            </td>

            <td className={Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss} data-label="Mudança 24h">
              <span>{Number(item.changePercent24Hr).toFixed(3)}</span> 
            </td>

          </tr>
          ))}
              
        </tbody>

      </table>

      <button className={styles.buttonMore} onClick={handleGetMore}>
        Carregar mais
      </button>
            
    </main>
    // toFixed(3) - quantas casa decimais eu quero
  )
}


