import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Select, TextInput, Textarea, Title } from '@mantine/core'
import { useCallback, useEffect, useRef, useState } from "react"
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useParams } from "react-router-dom"
import * as yup from "yup"
import { Result } from "../../../../types/v2data"
import { axiosPrivate } from "../../../api/axiosPrivate"
import styles from '../../page.module.css'
import Compositions from "./Compositions"
import ImageSelect from "./ImageSelect"
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
  length?: string,
  density?: string,
  weaving?: string,
  type_of_finish_uz?: string,
  type_of_finish_ru?: string,
  type_of_finish_en?: string,
  package_uz?: string,
  package_en?: string,
  package_ru?: string,
  yarn_number?: string,
  made_uz?: string,
  made_ru?: string,
  made_en?: string
}

const schema = yup.object({
  title_uz: yup.string().required().min(3).max(150),
  title_ru: yup.string().required().min(3).max(150),
  title_en: yup.string().required().min(3).max(150),
  description_uz: yup.string().required().min(3).max(255),
  description_ru: yup.string().required().min(3).max(255),
  description_en: yup.string().required().min(3).max(255),
  length: yup.string().max(100),
  density: yup.string().max(100),
  weaving: yup.string().max(100),
  type_of_finish_uz: yup.string().min(2).max(100),
  type_of_finish_ru: yup.string().min(2).max(100),
  type_of_finish_en: yup.string().min(2).max(100),
  package_uz: yup.string().min(2).max(100),
  package_en: yup.string().min(2).max(100),
  package_ru: yup.string().min(2).max(100),
  yarn_number: yup.string().max(100),
  made_uz: yup.string().min(2).max(100),
  made_en: yup.string().min(2).max(100),
  made_ru: yup.string().min(2).max(100)
}).required()


type Props = {
  subs: {value: string, label: string}[]
  ru_data: Result | null,
  en_data: Result | null,
  uz_data: Result | null,
}


const Two = ({ subs, en_data, ru_data, uz_data }: Props) => {
  const { id } = useParams()

  const [content, setContent] = useState<{
    id: number
    compound_uz: string
    compound_ru: string
    compound_en: string
    percentage: number
  }[]>([])

  const [loading, setLoading] = useState<boolean>(false)

  const imageRef = useRef<HTMLDivElement | null>(null)
  const subRef = useRef<HTMLInputElement | null>(null)
  const [subError, setSubError] = useState<string>("")
  const [subId, setSubId] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
    resolver: yupResolver(schema)
  })


  const onSubmit: SubmitHandler<FormValues> = async(data) => {
    // if (iamges.length !== 5) {
    //   notify("5 ta rasm tanlang", "error")
    //   return imageRef.current?.scrollIntoView({
    //     behavior: "smooth",
    //   });     
    // }

    if (!subId) {
      setSubError("Kategoriyani tanlang!")
      return subRef.current?.focus()
    }


    try {
      setLoading(true)
      const res = await axiosPrivate.patch(`/products/${id}/`, {
          title: data.title_ru,
          title_uz: data.title_uz,
          title_ru: data.title_ru,
          title_en: data.title_en,
          description: data.description_ru,
          description_uz: data.description_uz,
          description_ru: data.description_ru,
          description_en: data.description_en,
          product_type: "RMP",
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
          length: data.length,
          weaving: data.weaving,
          yarn_number: data.yarn_number
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

      setLoading(false)
      notify("Mahsulot muvaffaqqiyatli o'zgartirildi!", "success")
      setSubId(null)
      scrollToTop()
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
    
  }


  useEffect(() => {
    if (uz_data && en_data && ru_data) {
      setValue('title_uz', uz_data.title)
      setValue('title_en', en_data.title)
      setValue('title_ru', ru_data.title)

      setValue('description_uz', uz_data.description)
      setValue('description_en', en_data.description)
      setValue('description_ru', ru_data.description)

      setValue('made_uz', uz_data.made_in ? uz_data.made_in : '')
      setValue('made_en', en_data.made_in ? en_data.made_in : '')
      setValue('made_ru', ru_data.made_in ? ru_data.made_in : '')

      setValue('length', uz_data.length ? uz_data.length : '')
      setValue('density', uz_data.density ? uz_data.density : '')
      setValue('weaving', uz_data.weaving ? uz_data.weaving : '')
      
      setValue('yarn_number', uz_data.yarn_number ? uz_data.yarn_number : '')
      setValue('package_uz', uz_data.package ? uz_data.package : '')
      setValue('package_ru', ru_data.package ? ru_data.package : '')
      setValue('package_en', en_data.package ? en_data.package : '')

      setValue('type_of_finish_uz', uz_data.type_of_finish ? uz_data.type_of_finish : '')
      setValue('type_of_finish_ru', ru_data.type_of_finish ? ru_data.type_of_finish : '')
      setValue('type_of_finish_en', en_data.type_of_finish ? en_data.type_of_finish : '')
      setSubId(`${uz_data.subcategory.id}`)

    }
  }, [uz_data, en_data, ru_data, setValue])


  const getData = useCallback(() => {
    {
      if (uz_data && ru_data && en_data) {

        const a = uz_data.composition.map((item, index) => {
          return {
            id: item.id,
            compound_uz: item.compound,
            compound_en: en_data.composition[index].compound,
            compound_ru: ru_data.composition[index].compound,
            percentage: en_data.composition[index].percentage
          }
        })

        setContent(a)
      }
    }
  }, [uz_data, ru_data, en_data])


  useEffect(() => {
    getData()
  }, [getData])





  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.inputWrapper} ref={imageRef}>
        <ImageSelect id={Number(id)} />
      </div>

      <div className={styles.inputWrapper}>
        <Compositions product_id={Number(id)} />
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
        <Title size={14} my={10}> Uzunligi </Title>
          <TextInput
            {...register("length")}
            error={errors.length?.message}
            placeholder="Masalan: 240 - 360 sm"
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
        <Title size={14} my={10}> Ip raqami </Title>
          <TextInput
            {...register("yarn_number")}
            error={errors.yarn_number?.message}
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
          <Button loading={loading} disabled={loading} type="submit"> <Title size={14}> SAQLASH </Title> </Button>
       </div>
    </form>
  )
}

export default Two


function scrollToTop() {
  window.scrollTo(0, 0);
}
