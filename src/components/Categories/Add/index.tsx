import { useForm } from 'react-hook-form';
import classes from "./add.module.css"
import { useState, useEffect, useCallback } from 'react';
import { axiosPrivate } from '../../../api/axiosPrivate';
import { Textarea, Button, Text } from '@mantine/core';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AxiosError } from 'axios';
import TwemojiFlagUzbekistan from '../../icons/TwemojiFlagUzbekistan';
import TwemojiFlagRussia from '../../icons/TwemojiFlagRussia';
import FxemojiGreatbritainflag from '../../icons/FxemojiGreatbritainflag';
import { getSubcategoriesById } from '../../../api/data';
import MaterialSymbolsArrowBackRounded from '../../icons/MaterialSymbolsArrowBackRounded';
interface FormData {
  title_ru: string,
  title_en: string,
  title_uz: string,
}

const schema = yup
  .object({
    title_ru: yup.string().required().min(3),
    title_uz: yup.string().required().min(3),
    title_en: yup.string().required().min(3),
  })
  .required()

export default function CategoriesAdd() {

  const [titleProduct, setTitleProduct] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryId , setCategoryId] = useState<number>()
  const { id } = useParams()
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const handleFetchData = useCallback(async () => {
    if (id) {
      const [res_uz, res_ru, res_en] = await Promise.all([getSubcategoriesById(id, "uz"), getSubcategoriesById(id, "ru"), getSubcategoriesById(id, "en")])
      if (res_en && res_uz && res_ru) {
        setValue("title_uz", res_uz?.data.title)
        setValue("title_ru", res_ru.data.title)
        setValue("title_en", res_en.data.title)
        setCategoryId(res_uz.data.category)
        setTitleProduct(res_uz?.data.title);
      }
    }
  }, [id, setValue])

  useEffect(() => {
    handleFetchData()
  }, [handleFetchData])

console.log(id);

  const onSubmit = async (data: FormData) => {
    const new_data = { ...data, category: categoryId, title: data.title_uz }
    setLoading(true)
    try {
      await axiosPrivate.patch(`/subcategories/${id}/`, new_data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setLoading(false)
      reset()
      toast.success('Movafiqiyatli Qoshildi!')
      navigate(-1)
    } catch (error) {
      const axiosError = error as AxiosError;
      const myError = axiosError.request?.status ?? 0;
      const errorNumber = Math.floor(myError / 100);
      setLoading(false)
      if (errorNumber === 4) {
        toast.error('Xato malumot kiritildi!');
      } else if (errorNumber === 5) {
        toast.error('Uzir hatoliq yuz berdi!');
      } else {
        toast.error('Internet aloqasi yo`q!');
      }
    }
    navigate(-1)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.categoryAdd}>
      <div className={classes.headerForm}>
        <div className={classes.goBackBtn} onClick={() => navigate(-1)}>
          <Button size="md" leftSection={<MaterialSymbolsArrowBackRounded />} bg="#6EB648" className={classes.goBackBtn}>
            Chiqish
          </Button>
        </div>

        <Text fz="28" fw={'bold'}>{titleProduct}</Text>
      </div>

      <Textarea
        label={
          <span className={classes.inputLabelStyle}>
            <span >Ma'lumot</span> <TwemojiFlagUzbekistan fontSize={18} />
          </span>
        }
        placeholder="Title uz"
        {...register("title_uz")}
        error={errors.title_uz?.message}
        rows={4}
      />
      <Textarea
        label={
          <span className={classes.inputLabelStyle}>
            <span >Информация</span> <TwemojiFlagRussia fontSize={18} />
          </span>
        }
        placeholder="Title ru"
        {...register("title_ru")}
        error={errors.title_ru?.message}
        rows={4}
      />
      <Textarea
        label={
          <span className={classes.inputLabelStyle}>
            <span >Description</span> <FxemojiGreatbritainflag fontSize={18} />
          </span>
        }
        placeholder="Title en"
        {...register("title_en")}
        error={errors.title_ru?.message}
        rows={4}
      />

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



