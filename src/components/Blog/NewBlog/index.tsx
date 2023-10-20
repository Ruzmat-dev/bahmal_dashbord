import { useForm } from 'react-hook-form';
import classes from "./newBlog.module.css"
import { useRef, useState } from 'react';
import { axiosPrivate } from '../../../api/axiosPrivate';
import { Button, Loader, Textarea, Text } from '@mantine/core';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import toast, { Toaster } from 'react-hot-toast';
import { AxiosError } from 'axios';
import TwemojiFlagUzbekistan from '../../icons/TwemojiFlagUzbekistan';
import TwemojiFlagRussia from '../../icons/TwemojiFlagRussia';
import FxemojiGreatbritainflag from '../../icons/FxemojiGreatbritainflag';
import MaterialSymbolsDownload from '../../icons/MaterialSymbolsDownload';
import MaterialSymbolsArrowBackRounded from '../../icons/MaterialSymbolsArrowBackRounded';
import { useNavigate } from 'react-router-dom';
interface FormData {
  "title_ru": string,
  "title_en": string,
  "title_uz": string,
  "description_ru": string,
  "description_en": string,
  "description_uz": string,
}

const schema = yup
  .object({
    title_ru: yup.string().required().min(3),
    title_uz: yup.string().required().min(3),
    title_en: yup.string().required().min(3),
    description_ru: yup.string().required().min(3),
    description_en: yup.string().required().min(3),
    description_uz: yup.string().required().min(3),
  })
  .required()

export default function NewBlog() {
  const fileRef = useRef<HTMLInputElement | null>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewImage] = useState<string>('https://content.hostgator.com/img/weebly_image_sample.png');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const new_data = { ...data, image: selectedFile, title: data.title_uz, description: data.description_uz }
    console.log(new_data);

    try {
       await axiosPrivate.post('/blogs/', new_data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Movafiqiyatli Qoshildi!')
      setIsSubmitting(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      const myError = axiosError.request?.status ?? 0;
      const errorNumber = Math.floor(myError / 100);

      if (errorNumber === 4) {
        toast.error('Xato malumot kiritildi!');
      } else if (errorNumber === 5) {
        toast.error('Uzir hatoliq yuz berdi!');
      } else {
        toast.error('Internet aloqasi yo`q!');
      }
      setIsSubmitting(false);
    }
  }

  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewImage(result)
      }
      setSelectedFile(file)
      reader.readAsDataURL(file)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.blogAdd}>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", alignSelf: "center" }}>
        <Button size="md" leftSection={<MaterialSymbolsArrowBackRounded />} bg="#6EB648" className={classes.goBackBtn} onClick={() => navigate(-1)}>
          Chiqish
        </Button>
        <Text c="#6EB648" size='xl' fw={'initial'}> Yangi Maqola qo`shish </Text>
        <div className={classes.imgWrapper}>
          <div className={classes.imgWrapperItem} onClick={() => fileRef.current?.click()}>
            <span>
              <MaterialSymbolsDownload fontSize={56} color='#6EB648' />
            </span>
          </div>
          <div className={classes.wrapperImages}>
            <input
              hidden
              ref={fileRef}
              accept='image/*'
              onChange={handleFileChange}
              type="file"
              id="picture"
            />

            <img
              src={previewURL}
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
          style={{ flex: "1", height: "60px" }}
          size='md'
          h={70}
          placeholder="Nomi"
          {...register("title_uz")}
          error={errors.title_uz?.message}
          rows={4}
        />
        <Textarea
          label={
            <span className={classes.inputLabelStyle}>
              <span >Названия</span> <TwemojiFlagRussia fontSize={18} />
            </span>
          }
          placeholder="Названия"
          style={{ flex: "1" }}
          size='md'
          {...register("title_ru")}
          error={errors.title_ru?.message}
          rows={4}
        />
        <Textarea
          label={
            <span className={classes.inputLabelStyle}>
              <span >Title</span> <FxemojiGreatbritainflag fontSize={18} />
            </span>
          }
          placeholder="Title"
          style={{ flex: "1" }}
          size='md'
          {...register("title_en")}
          error={errors.title_ru?.message}
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
          error={errors.description_uz?.message}
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
          error={errors.description_ru?.message}
          style={{ flex: "1" }}
          size='md'
          rows={8}
        />

          <Textarea
            placeholder="Description"
            {...register("description_en")}
            label={
              <span className={classes.inputLabelStyle}>
                <span >Description</span> <FxemojiGreatbritainflag fontSize={18} />
              </span>} 
              style={{ flex: "1" }}
              error={errors.description_en?.message} 
              size='md'
              rows={8}
          />
      </div>
      <Button disabled={isSubmitting} type='submit' color='#6EB648' h={50} w={435} size='md'>
        <Text >
          {isSubmitting ? <Loader color='#6EB648' /> : 'Qoshish'}
        </Text>
      </Button>

      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </form>
  );
}



