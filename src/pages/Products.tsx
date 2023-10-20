import { Button, Pagination, Select } from '@mantine/core'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Result } from '../../types/v2data'
import { getProductsData } from '../api/data'
import { useAppSelector } from '../app/hooks'
import TableProducts from '../components/Products/TableProducts'
import styles from './page.module.css'

const Products = () => {
  const navigate = useNavigate()
  const { isChange } = useAppSelector((state) => state.changeSlice)
  const [data, setData] = useState<Result[]>([])
  const [pageSize, setPageSize] = useState<string | null>('10')
  const [page, setPage] = useState<number>(1)
  const [count, setCount] = useState<number>(0)
  // const [next,setNext] = useState<string | null>(null)
  // const [previous, setPrevious] = useState<string | null>(null)


  const fetchData = useCallback(async() => {
    try {
      const res = await getProductsData(`?page=${page}&page_size=${pageSize ? pageSize : 10}`)
      if (res) {
        setData(res.data.results)
        setCount(res.data.count)
        // setNext(res.data.next)
        // setPrevious(res.data.previous)
      }
    } catch (error) {
      console.log(error)
    }
  }, [page, pageSize])




  useEffect(() => {
  fetchData()
  }, [fetchData, isChange])

  return (
    <div className={styles.products_container}>
      <div className={styles.headerContent}>
        <h4>Mahsulotlar ({count})</h4>
        <Button onClick={() => navigate('/products/add')} variant='default'>
          Mahsulot qo'shish
        </Button>
      </div>
      <TableProducts data={data}/>
      <div className={styles.footerContent}>
        <Pagination total={Math.ceil(count / Number(pageSize))} onChange={setPage}/>
        <Select
          w={80}
          onChange={setPageSize}
          defaultValue={String(pageSize)}
          data={['10', '30', '50', '100']}
        />
      </div>
    </div>
  )
}

export default Products