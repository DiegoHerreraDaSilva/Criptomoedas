import {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router'
import type { CoinProps } from '../home';
import styles from './detail.module.css'

interface ResponseData {
  data: CoinProps
}

interface ErrorData {
  error: string;
}

type DataProps = ResponseData | ErrorData

export function Detail() {
  const { cripto } = useParams();
  const navigate = useNavigate();

  const  [coin, setCoin] = useState<CoinProps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCoin(){

      try{
        fetch(`https://rest.coincap.io/v3/assets/${cripto}?apiKey=d68e8f13270a694ef0041f10325f9674dedc33ae861837182597334414feea4a`)
        .then(response => response.json())
        .then((data: DataProps) => {
          if("error" in  data){
            navigate("/")
            return;

          }

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

            const resultData = {
              ...data.data,
                formatedPrice: price.format(Number(data.data.priceUsd)), // Formata o preço da moeda em dolar
                formatedMarket: priceCompact.format(Number(data.data.marketCapUsd)), // Formata o preço de mercado em dolar e compacta o valor
                formatedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr)) // Formata o volume em dolar e compacta o valor
            }
            setCoin(resultData)
            setLoading(false)

        })

      }catch(err){
        console.log(err);
        navigate("/")
      }

    }

    getCoin();

  }, [cripto])

  if(loading || !coin){
    return(
      <div className={styles.container}>
        <h4 className={styles.center}>Carregando detalhes</h4>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{coin?.name}</h1>
      <h1 className={styles.center}>{coin?.symbol}</h1>

      <section className={styles.content}>
        <img 
        src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`} 
        alt="Logo da moeda"
        className={styles.logo}
        />

        <h1>{coin?.name} | {coin?.symbol}</h1>

        <p><strong>Preçp: {coin?.formatedPrice}</strong></p>

        <a href="">
          <strong>Mercado: {coin?.formatedMarket}</strong>
        </a>

        <a href="">
          <strong>Volume: {coin?.formatedVolume}</strong>
        </a>

        <a href="">
          <strong>Mudança 24h: </strong> <span className={Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss}>
          {Number(coin?.changePercent24Hr).toFixed(3)}</span>
        </a>

      </section>
    </div>
  )
}


