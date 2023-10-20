import { useCallback, useEffect, useRef, useState } from "react"
import classes from "./edit.module.css"
import { Button, Text, Textarea } from '@mantine/core';
import MaterialSymbolsArrowBackRounded from '../../icons/MaterialSymbolsArrowBackRounded';
import MaterialSymbolsDownload from '../../icons/MaterialSymbolsDownload';
import TwemojiFlagUzbekistan from '../../icons/TwemojiFlagUzbekistan';
import TwemojiFlagRussia from '../../icons/TwemojiFlagRussia';
import FxemojiGreatbritainflag from '../../icons/FxemojiGreatbritainflag';
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getBlogById } from "../../../api/data";
import { convertImageToFileURL } from "../../../utils/helpers";
import { axiosPrivate } from "../../../api/axiosPrivate";
import { AxiosError } from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

type FormData = {
  title_uz?: string;
  title_ru?: string;
  title_en?: string;
  description_uz?: string;
  description_ru?: string;
  description_en?: string;
  image?: File
};

const schema = yup
  .object({
    title_ru: yup.string(),
    title_uz: yup.string(),
    title_en: yup.string(),
    description: yup.string(),
    description_ru: yup.string(),
    description_en: yup.string(),
    description_uz: yup.string(), 
  })
  .required()

export default function EditBlog() {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [parentName, setParentName] = useState<string | undefined | null>('')
  const [imageUrl, setImageUrl] = useState<string>("")
  const { register, setValue, handleSubmit  } = useForm<FormData>({resolver: yupResolver(schema)})
  
  const { id } = useParams()

  const handleFetchData = useCallback(async () => {
    if (id) {
      const [res_uz, res_ru, res_en] = await Promise.all([getBlogById(id, "uz"), getBlogById(id , "ru"), getBlogById(id , "en")])
      if (res_en && res_uz && res_ru) {
        setValue("title_uz", res_uz.data.title)
        setValue("title_ru", res_ru.data.title)
        setValue("title_en", res_en.data.title)
        setValue("description_uz", res_uz.data.description)
        setValue("description_ru", res_ru.data.description)
        setValue("description_en", res_en.data.description)
        setImageUrl(res_en.data.image)
        setParentName(res_uz.data.title)
      }
    }
  }, [id, setValue])

  useEffect(() => {
    handleFetchData()
  }, [handleFetchData])
  const navigate = useNavigate();



  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true)
    try {
      await axiosPrivate.patch(`/blogs/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      setLoading(false)
      toast.success('Movafiqiyatli Qoshildi!')
      navigate(-1)
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(error);

      const myError = axiosError.request?.status ?? 0;
      const errorNumber = Math.floor(myError / 100);

      if (errorNumber === 4) {
        toast.error('Xato malumot kiritildi!');
      } else if (errorNumber === 5) {
        toast.error('Uzir hatoliq yuz berdi!');
      } else {
        toast.error('Internet aloqasi yo`q!');
      }
      setLoading(false)
    }
  }
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setValue('image', files[0])
      const url_image = await convertImageToFileURL(files[0])
      if (typeof url_image === "string") {
        setImageUrl(url_image)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.catalogAdd}>
      <div className={classes.headerForm}>
        <div className={classes.goBackBtn} onClick={() => navigate(-1)}>
          <Button size="md" leftSection={<MaterialSymbolsArrowBackRounded />} bg="#6EB648" className={classes.goBackBtn}>
            Chiqish
          </Button>
        </div>
        <Text c="#6EB648" size='xl' fw={'initial'}> {parentName ?? "PARENT C"} </Text>
        <div className={classes.imgWrapper} onClick={() => fileRef.current?.click()}>
          <div className={classes.imgWrapperItem}>
            <span>
              <MaterialSymbolsDownload fontSize={56} color='#6EB648' />
            </span>
          </div>
          <div className={classes.wrapperImages}>
            <input
              hidden
              accept='image/*'
              type="file"
              ref={fileRef}
              onChange={handleFileChange}
              id="picture"
            />
            <img
              src={imageUrl}
              alt="Preview"
            />
          </div>
        </div>
      </div>
      <div className={classes.wrapperInputs}>
        <Textarea
          label={
            <span className={classes.inputLabelStyle}>
              <span >Nomi</span> <TwemojiFlagUzbekistan fontSize={18} />
            </span>
          }
          {...register("title_uz")}
          style={{ flex: "1", height: "60px" }}
          size='md'
          h={70}
          rows={4}
        />
        <Textarea
          label={
            <span className={classes.inputLabelStyle}>
              <span >Названия</span> <TwemojiFlagRussia fontSize={18} />
            </span>
          }
          placeholder="Названия"
          {...register("title_ru")}
          style={{ flex: "1" }}
          size='md'
          rows={4}
        />
        <Textarea
          label={
            <span className={classes.inputLabelStyle}>
              <span >Title</span> <FxemojiGreatbritainflag fontSize={18} />
            </span>
          }
          placeholder="Title"
          {...register("title_en")}
          style={{ flex: "1" }}
          size='md'
          rows={4}
        />
      </div>
      <div className={classes.wrapperInputs}>
        <Textarea
          label={
            <span className={classes.inputLabelStyle}>
              <span >Ma'lumot</span> <TwemojiFlagUzbekistan fontSize={18} />
            </span>
          }
          placeholder="Ma'lumot"
          {...register("description_uz")}
          style={{ flex: "1" }}
          size='md'
          rows={8}
        />
        <Textarea
          label={
            <span className={classes.inputLabelStyle}>
              <span >Информация</span> <TwemojiFlagRussia fontSize={18} />
            </span>
          }
          placeholder="Информация"
          {...register("description_ru")}
          style={{ flex: "1" }}
          size='md'
          rows={8}
        />
        <Textarea
          label={
            <span className={classes.inputLabelStyle}>
              <span >Description</span> <FxemojiGreatbritainflag fontSize={18} />
            </span>
          }
          placeholder="Description"
          {...register("description_en")}
          style={{ flex: "1" }}
          size='md'
          rows={8}
        />
      </div>
      <Button loading={loading} disabled={loading} type='submit' color='#6EB648' h={50} w={435} size='md' className={classes.goBackBtn}>
        Qoshish
      </Button>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </form>
  );
}



