import { useForm } from 'react-hook-form';
import classes from "./add.module.css"
import { useState , useEffect } from 'react';
import { axiosPrivate } from '../../../api/axiosPrivate';
import { TextInput, Button, Text , Loader} from '@mantine/core';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useParams } from 'react-router-dom';
import { axiosPublic } from '../../../api/axiosPublic';
import { IdCategory } from '../../../../types/data';
import toast, { Toaster } from 'react-hot-toast';
import { AxiosError } from 'axios';
interface FormData {
  "title": string,
  "title_ru": string,
  "title_en": string,
  "title_uz": string,
  "description": string,
  "description_ru": string,
  "description_en": string,
  "description_uz": string,
}

const schema = yup
  .object({
    title: yup.string().required().min(3),
    title_ru: yup.string().required().min(3),
    title_uz: yup.string().required().min(3),
    title_en: yup.string().required().min(3),
    description: yup.string().required().min(3),
    description_ru: yup.string().required().min(3),
    description_en: yup.string().required().min(3),
    description_uz: yup.string().required().min(3),
  })
  .required()

export default function CategoriesAdd() {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL,] = useState<string>('');
  const [titleProduct , setTitleProduct] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { id } = useParams()

  const CategoryId = async () => {
     try {
        const res = await axiosPublic("uz").get<IdCategory>(`/categories/${id}/`);
        setTitleProduct(res.data.title);  
      } catch (error) {
        console.log(error);
      }
  }

  useEffect(() => {
    CategoryId()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const new_data = { ...data, image: selectedFile, parent: id }
    try {
      await axiosPrivate.post('/categories/', new_data, {
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.catalogAdd}>
      <Text fz="28" fw={'bold'}>{titleProduct}</Text>
      <TextInput
        label="Title"
        type='text'
        withAsterisk
        placeholder="Input placeholder"
        {...register("title")}
        error={errors.title?.message}
      />
      <TextInput
        label="Title uz"
        withAsterisk
        type='text'
        placeholder="Title uz"
        {...register("title_uz")}
        error={errors.title_uz?.message}
      />
      <TextInput
        label="Title ru"
        withAsterisk
        type='text'
        placeholder="Title ru"
        {...register("title_ru")}
        error={errors.title_ru?.message}
      />
      <TextInput
        label="Title en"
        withAsterisk
        type='text'
        placeholder="Title en"
        {...register("title_en")}
        error={errors.title_ru?.message}
      />
      <TextInput
        label="Description"
        withAsterisk
        type='text'
        placeholder="Description"
        {...register("description")}
        error={errors.description?.message}
      />
      <TextInput
        label="Description uz"
        withAsterisk
        type='text'
        placeholder="Description uz"
        {...register("description_uz")}
        error={errors.description_uz?.message}
      />
      <TextInput
        label="Description ru"
        withAsterisk
        type='text'
        placeholder="Description ru"
        {...register("description_ru")}
        error={errors.description_ru?.message}
      />
      <TextInput
        label="Description en"
        withAsterisk
        type='text'
        placeholder="Description en"
        {...register("description_en")}
        error={errors.description_en?.message}
      />
      <div className={classes.wrapperImages}>
        <input
          accept='image/*'
          onChange={handleFileChange}
          type="file"
          id="picture"
        />
        {/* </Field> */}
        {selectedFile && (
          <img
            src={previewURL}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '200px' }}
          />
        )}
      </div>
      {/* <input type="submit" /> */}
      <Button disabled={isSubmitting} type='submit' color='#6EB648'>
      {isSubmitting ? <Loader color='#6EB648'/> : 'Qoshish'}
      </Button>

      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </form>
  );
}



