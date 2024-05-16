"use client"
import { useState, useTransition } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [address, setAddress] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState();


  const handleClick = () => startTransition(async () => {
    if (!address) {
      return alert("请输入地址")
    }
    try {
      const response = await fetch(`/api/faucet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address
        })
      })
      if (!response.ok) {
        const errMsg = await response.text()
        // 如果状态码不在 200-299 范围内，表示出现了错误
        throw new Error(errMsg);
      }
      const res = await response.json()
      console.log('[ r ] >', res)
      if (res) {
        setErrMsg('')
        setResult(res)
        console.log('[ res ] >', res)
      }
    } catch (error: any) {
      setErrMsg(error.message)
    }
  })

  return (
    <main className={styles.main}>

      <div className={styles.center} />
      <div className={styles.form}>
        <h1 style={{ textAlign: 'center' }}>APTOS Faucet</h1>
        <input
          style={{height: 30}}
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <button
          style={{ height: 30 }}
          onClick={handleClick}
          disabled={isPending}
        >
          {isPending ? 'Pending' : 'Get Funds'}
        </button>
        {
          !!result &&
          <pre className={styles.result}>
            {
              JSON.stringify(result, null, 2)
            }
          </pre>
        }
        <div className={styles.errMsg}>
          {
            errMsg
          }
        </div>
      </div>
    </main>
  );
}
