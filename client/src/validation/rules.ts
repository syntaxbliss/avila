import dayjs from 'dayjs';
import _ from 'lodash';
import { EnumLike, z } from 'zod';

export const validationRules = {
  string: (trim: boolean = true, min: number | undefined, max: number | undefined) => {
    let schema = z.string();

    if (trim) {
      schema = schema.trim();
    }

    if (!_.isUndefined(min)) {
      if (min === 1) {
        schema = schema.min(min, 'Este campo es obligatorio.');
      } else {
        schema = schema.min(min, `Este campo debe contener al menos ${min} caracteres.`);
      }
    }

    if (!_.isUndefined(max)) {
      schema = schema.max(max, `Este campo no puede contener más de ${max} caracteres.`);
    }

    return schema;
  },

  enum: (e: EnumLike, required: boolean = true) => {
    if (required) {
      return z.nativeEnum(e, { errorMap: () => ({ message: 'Este campo es obligatorio.' }) });
    }

    return z.nativeEnum(e).or(z.literal(''));
  },

  decimal: (min: number | undefined, max: number | undefined, required: boolean = true) => {
    let schema = z.number({
      required_error: 'Este campo es obligatorio.',
      invalid_type_error: 'Ingrese un número válido.',
    });

    if (!_.isUndefined(min)) {
      schema = schema.min(min, `Este campo debe ser mayor o igual a ${min}.`);
    }

    if (!_.isUndefined(max)) {
      schema = schema.max(max, `Este campo debe ser menor o igual a ${max}.`);
    }

    return z.preprocess(
      val => {
        const v = String(val).trim();

        if (v.length) {
          return parseFloat(v);
        }

        return undefined;
      },
      required ? schema : schema.optional()
    );
  },

  email: (required: boolean = true) => {
    const schema = z.string().trim().email('Ingrese una dirección de email válida.');

    return z.preprocess(
      val => {
        const v = String(val).trim();

        if (v.length) {
          return v;
        }

        return undefined;
      },
      required ? schema : schema.optional()
    );
  },

  date: (required: boolean = true) => {
    const schema = required
      ? z.string().trim().min(1, 'Este campo es obligatorio.')
      : z.string().trim();

    return schema.transform(val => {
      const date = dayjs(val);

      if (date.isValid()) {
        return date.toDate();
      }

      return undefined;
    });
  },
};
