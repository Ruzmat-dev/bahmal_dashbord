import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Group, Modal, NumberInput, Pill, Radio, Select, Slider, TextInput, Textarea, Title } from '@mantine/core'
import { useDisclosure } from "@mantine/hooks"
import { useRef, useState } from "react"
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as yup from "yup"
import { axiosPrivate } from "../../../api/axiosPrivate"
import { changeFiles } from "../../../app/features/filesSlice"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import styles from '../../page.module.css'
import ImageSelect from "../components/ImageSelect"
import EmojioneFlagForRussia from './icons/EmojioneFlagForRussia'
import EmojioneFlagForUnitedKingdom from './icons/EmojioneFlagForUnitedKingdom'
import EmojioneFlagForUzbekistan from './icons/EmojioneFlagForUzbekistan'

const notify = (text: string, type: 'error' | 'success') => toast[type](text);
type FormValues = {
  title_ru: string,
  title_uz: string,
  title_en: string,
  description_ru: string,
  description_uz: string,
  description_en: string,
  density: string,
  type_of_finish_uz?: string,
  type_of_finish_ru?: string,
  type_of_finish_en?: string,
  package_uz?: string,
  package_en?: string,
  package_ru?: string,
  design_code?: string,
  made_uz?: string,
  made_ru?: string,
  made_en?: string
  weaving?: string
}

const schema = yup.object({
  title_uz: yup.string().required().min(3).max(150),
  title_ru: yup.string().required().min(3).max(150),
  title_en: yup.string().required().min(3).max(150),
  description_uz: yup.string().required().min(3).max(255),
  description_ru: yup.string().required().min(3).max(255),
  description_en: yup.string().required().min(3).max(255),
  density: yup.string().required().min(2).max(100),
  type_of_finish_uz: yup.string().min(2).max(100),
  type_of_finish_ru: yup.string().min(2).max(100),
  type_of_finish_en: yup.string().min(2).max(100),
  package_uz: yup.string().min(2).max(100),
  package_en: yup.string().min(2).max(100),
  package_ru: yup.string().min(2).max(100),
  design_code: yup.string().min(2).max(100),
  made_uz: yup.string().min(2).max(100),
  made_en: yup.string().min(2).max(100),
  made_ru: yup.string().min(2).max(100),
  weaving: yup.string().min(2).max(100)
}).required()


type Props = {
  subs: {value: string, label: string}[]
}

const Four = ({ subs }: Props) => {
  const [height, setHeight] = useState<number | string>(0)
  const [width, setWidth] = useState<number | string>(0)
  const [measur, setMeasure] = useState<string>("m")

  const [opened, { open, close }] = useDisclosure(false);
  const [content_uz, setContentUz] = useState<string>('')
  const [content_ru, setContentRu] = useState<string>('')
  const [content_en, setContentEn] = useState<string>('')
  const [prosent, setProsent] = useState<number>(0)
  const [content, setContent] = useState<{
    compound_uz: string
    compound_ru: string
    compound_en: string
    percentage: number
  }[]>([])

  const { files } = useAppSelector((state) => state.filesSlice)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)

  const imageRef = useRef<HTMLDivElement | null>(null)
  const subRef = useRef<HTMLInputElement | null>(null)
  const [subError, setSubError] = useState<string>("")
  const [subId, setSubId] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: yupResolver(schema)
  })


  const onSubmit: SubmitHandler<FormValues> = async(data) => {
    if (files.length !== 5) {
      notify("5 ta rasm tanlang", "error")
      return imageRef.current?.scrollIntoView({
        behavior: "smooth",
      });     
    }

    if (!subId) {
      setSubError("Kategoriyani tanlang!")
      return subRef.current?.focus()
    }


    try {
      setLoading(true)
      const res = await axiosPrivate.post(`/products/`, {
          title: data.title_ru,
          title_uz: data.title_uz,
          title_ru: data.title_ru,
          title_en: data.title_en,
          description: data.description_ru,
          description_uz: data.description_uz,
          description_ru: data.description_ru,
          description_en: data.description_en,
          product_type: "DP",
          subcategory: subId,
          density: data.density,
          type_of_finish: data.type_of_finish_ru,
          type_of_finish_uz: data.type_of_finish_uz,
          type_of_finish_ru: data.type_of_finish_ru,
          type_of_finish_en: data.type_of_finish_en,
          package: data.package_ru,
          package_uz: data.package_uz,
          package_ru: data.package_ru,
          package_en: data.package_en,
          made_in: data.made_ru,
          made_in_uz: data.made_uz,
          made_in_ru: data.made_ru,
          made_in_en: data.made_en,
          design_code: data.design_code,
      })

       files.forEach(async(item) => {
        const formData = new FormData()
        formData.append("image", item)
        formData.append("product ", res.data.id)
        await axiosPrivate.post('/product_images/', formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
      })

      content.forEach(async(item) => {
        await axiosPrivate.post(`/product_compositions/`, {
          percentage: 100,
          compound: item.compound_ru,
          compound_ru: item.compound_ru,
          compound_en: item.compound_en,
          compound_uz: item.compound_uz,
          product: res.data.id
        })
      })


      await axiosPrivate.post(`/product_sizes/`, {
        height: height,
        width: width,
        size_type: measur,
        size_type_uz: measur,
        size_type_ru: measur,
        size_type_en: measur,
        product: res.data.id
      })

      setLoading(false)
      notify("Mahsulot muvaffaqqiyatli bazaga qo'shildi!", "success")
      reset()
      setContent([])
      dispatch(changeFiles([]))
      setSubId(null)
      scrollToTop()
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
    
  }

 
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.inputWrapper} ref={imageRef}>
        <ImageSelect />
      </div>

      <div className={styles.inputWrapper}>
      <Title size={14} my={10}> Mahsulot tarkibi </Title>
        {content.map((item, index) => (
          <Pill key={index} size="sm" onClickCapture={() => {
            const d = content.filter((i) => i !== item)
            setContent(d)
          }} withRemoveButton>{item.compound_uz} {item.percentage}%</Pill>
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
            <Button onClick={() => {
              setContent([...content, { compound_en: content_en, compound_ru: content_ru, compound_uz: content_uz, percentage: prosent }])
              close()
              setContentEn('')
              setContentUz('')
              setContentRu('')
              setProsent(0)
            }} mt={30}>
              <Title size={14} my={10}> QO'SHISH </Title>
            </Button>
          </div>
        </Modal>
      </div>

      <div className={styles.inputWrapper}>
      <Title size={14} my={10}> Mahsulot o'lchami </Title>
        <div className={styles.sizeInputBox}>
          <NumberInput
            label="Boyi"
            onChange={setHeight}
            defaultValue={height}
          />

          <NumberInput
            label="Eni"
            onChange={setWidth}
            defaultValue={width}
          />

        <Radio.Group
            name="favoriteFramework"
            description="O'lchov birligi"
            withAsterisk
            value={measur}
            onChange={setMeasure}
          >
            <Group mt="xs">
              <Radio value="sm" label="Santimet" />
              <Radio value="m" label="Metr" />
              <Radio value="km" label="KM" />
            </Group>
          </Radio.Group>
        </div>
      </div>

       <div className={styles.inputWrapper}>
       <Title size={14} my={10}> Mahsulot nomi </Title>
        <TextInput
          leftSection={<EmojioneFlagForUzbekistan />}
          {...register("title_uz")}
          error={errors.title_uz?.message}
          placeholder="O'zbek tilida"
        />
        <TextInput
          leftSection={<EmojioneFlagForRussia />}
          {...register("title_ru")}
          mt={10}
          error={errors.title_ru?.message}
          placeholder="Rus tilida"
        />
        <TextInput
          leftSection={<EmojioneFlagForUnitedKingdom />}
          {...register("title_en")}
          mt={10}
          error={errors.title_en?.message}
          placeholder="Ingliz tilida"
        />
       </div>

       <div className={styles.inputWrapper}>
          <Select
            ref={subRef}
            label={"Subkategoriya"}
            data={subs}
            value={subId}
            onChange={(e) => { setSubId(e); setSubError("") }}
            error={subError}
            searchable
            nothingFoundMessage={"Kategoriya topilmadi"}
          />
       </div>


       <div className={styles.inputWrapper}>
          <Title size={14} my={10}> Mahsulot tavsifi </Title>

          <Textarea
            description={<EmojioneFlagForUzbekistan fontSize={16} />}
            {...register("description_uz")}
            placeholder="Mahsulot ta'riflab bering"
            error={errors.description_uz?.message}
            mt={10}
            rows={2}
          />

          <Textarea
            description={<EmojioneFlagForRussia fontSize={16} />}
            {...register("description_ru")}
            placeholder="Mahsulot ta'riflab bering"
            error={errors.description_ru?.message}
            mt={10}
            rows={2}
          />

          <Textarea
            description={<EmojioneFlagForUnitedKingdom fontSize={16} />}
            {...register("description_en")}
            placeholder="Mahsulot ta'riflab bering"
            error={errors.description_en?.message}
            mt={10}
            rows={2}
          />
       </div>

       <div className={styles.inputWrapper}>
        <Title size={14} my={10}> Zichligi </Title>
          <TextInput
            {...register("density")}
            error={errors.density?.message}
            placeholder="Masalan: 240 gr/m2"
          />
       </div>


       <div className={styles.inputWrapper}>
        <Title size={14} my={10}> To'qilishi </Title>
          <TextInput
            {...register("weaving")}
            error={errors.weaving?.message}
            placeholder="Masalan: 2\\2"
          />
       </div>

       <div className={styles.inputWrapper}>
        <Title size={14} my={10}> Dizayn kodi </Title>
          <TextInput
            {...register("design_code")}
            error={errors.design_code?.message}
            placeholder="Masalan: 2025"
          />
       </div>


       <div className={styles.inputWrapper}>
        <Title size={14} my={10}> Tashqi ko'rinish </Title>
          <TextInput
            leftSection={<EmojioneFlagForUzbekistan />}
            {...register("type_of_finish_uz")}
            error={errors.type_of_finish_uz?.message}
            placeholder="O'zbek tilida"
          />
          <TextInput
            leftSection={<EmojioneFlagForRussia />}
            {...register("type_of_finish_ru")}
            mt={10}
            error={errors.type_of_finish_ru?.message}
            placeholder="Rus tilida"
          />
          <TextInput
            leftSection={<EmojioneFlagForUnitedKingdom />}
            {...register("type_of_finish_en")}
            mt={10}
            error={errors.type_of_finish_en?.message}
            placeholder="Ingliz tilida"
          />
        </div>


        <div className={styles.inputWrapper}>
        <Title size={14} my={10}> O'ram </Title>
          <TextInput
            leftSection={<EmojioneFlagForUzbekistan />}
            {...register("package_uz")}
            error={errors.package_uz?.message}
            placeholder="O'zbek tilida"
          />
          <TextInput
            leftSection={<EmojioneFlagForRussia />}
            {...register("package_ru")}
            mt={10}
            error={errors.package_ru?.message}
            placeholder="Rus tilida"
          />
          <TextInput
            leftSection={<EmojioneFlagForUnitedKingdom />}
            {...register("package_en")}
            mt={10}
            error={errors.package_en?.message}
            placeholder="Ingliz tilida"
          />
        </div>


        <div className={styles.inputWrapper}>
        <Title size={14} my={10}> Ishlab chiqarilgan davlat </Title>
          <TextInput
            leftSection={<EmojioneFlagForUzbekistan />}
            {...register("made_uz")}
            error={errors.made_uz?.message}
            placeholder="O'zbek tilida"
          />
          <TextInput
            leftSection={<EmojioneFlagForRussia />}
            {...register("made_ru")}
            mt={10}
            error={errors.made_ru?.message}
            placeholder="Rus tilida"
          />
          <TextInput
            leftSection={<EmojioneFlagForUnitedKingdom />}
            {...register("made_en")}
            mt={10}
            error={errors.made_en?.message}
            placeholder="Ingliz tilida"
          />
        </div>

       <div className={styles.inputWrapper}>
          <Button loading={loading} disabled={loading} type="submit"> <Title size={14}> KEYINGI </Title> </Button>
       </div>
    </form>
  )
}

export default Four


function scrollToTop() {
  window.scrollTo(0, 0);
}
