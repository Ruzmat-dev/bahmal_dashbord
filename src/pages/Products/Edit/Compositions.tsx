import { Button, Modal, Pill, Slider, TextInput, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useCallback, useEffect, useState } from "react"
import { axiosPrivate } from "../../../api/axiosPrivate"
import { axiosPublic } from "../../../api/axiosPublic"
import styles from '../../page.module.css'
import EmojioneFlagForRussia from "./icons/EmojioneFlagForRussia"
import EmojioneFlagForUnitedKingdom from "./icons/EmojioneFlagForUnitedKingdom"
import EmojioneFlagForUzbekistan from "./icons/EmojioneFlagForUzbekistan"

type Props = {
    product_id: number
}

export type Composition = {
    id: number
    percentage: number
    compound: string
    product: number
}

const Compositions = ({ product_id }: Props) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [content_uz, setContentUz] = useState<string>('')
    const [content_ru, setContentRu] = useState<string>('')
    const [content_en, setContentEn] = useState<string>('')
    const [prosent, setProsent] = useState<number>(0)
    const [data, setData] = useState<Composition[]>([])


  const fetchData = useCallback(async() => {
    try {
        const res = await axiosPublic('uz').get<Composition[]>(`/product_compositions/`)
        const data = res.data.filter((item) => item.product === product_id)
        setData(data)
    } catch (error) {
        console.log(error)
    }
  }, [product_id])


  useEffect(() => {
    fetchData()
  }, [fetchData])



  const handleDeleteId = async(id: number) => {
    try {
      await axiosPrivate.delete(`/product_compositions/${id}/`)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }
 


  const handleAdd = async() => {
    try {
        await axiosPrivate.post(`/product_compositions/`, {
            percentage: prosent,
            compound: content_uz,
            compound_ru: content_ru,
            compound_en: content_en,
            compound_uz: content_uz,
            product: product_id
        })
        fetchData()
        close()
    } catch (error) {
        console.log(error)
    }
  }

  return (
        <>
        <Title size={14} my={10}> Mahsulot tarkibi </Title>
          {data.map((item, index) => (
            <Pill key={index} size="sm" onClickCapture={() => handleDeleteId(item.id)} withRemoveButton>{item.compound} {item.percentage}%</Pill>
          ))}
        <Button onClick={open} ml={10} size="xs" variant="default" radius={"lg"}>+</Button>

        <Modal opened={opened} onClose={close} title="Mahsulot tarkibi qo'shish">
        <div className={styles.inputWrapper}>
          <Title size={14} my={10}> Xomashyo nomi </Title>
          <TextInput
            autoFocus
            value={content_uz}
            onChange={(e) => setContentUz(e.target.value)}
            leftSection={<EmojioneFlagForUzbekistan />}
            placeholder="O'zbek tilida"
          />
          <TextInput
            value={content_ru}
            onChange={(e) => setContentRu(e.target.value)}
            leftSection={<EmojioneFlagForRussia />}
            mt={10}
            placeholder="Rus tilida"
          />
          <TextInput
            value={content_en}
            onChange={(e) => setContentEn(e.target.value)}
            leftSection={<EmojioneFlagForUnitedKingdom />}
            mt={10}
            placeholder="Ingliz tilida"
          />
          </div>
          <div className={styles.inputWrapper}>
            <Title size={14} my={10}> Miqdori % </Title>
            <Slider
              color="blue"
              value={prosent}
              onChange={setProsent}
              marks={[
                { value: 20, label: '20%' },
                { value: 50, label: '50%' },
                { value: 80, label: '80%' },
              ]}
            />
          </div>


          <div style={{ justifyContent: "center", display: "flex" }} className={styles.inputWrapper}>
            <Button onClick={handleAdd} mt={30}>
              <Title size={14} my={10}> QO'SHISH </Title>
            </Button>
          </div>
        </Modal>
      </>
  )
}

export default Compositions