import { useState } from 'react';
import { post, postProps } from './api.helpers';
import { validationHelper, validationRules } from './validation.helpers';

export const useForm = (
  submitControl: postProps,
  confirmation?: boolean,
  onSuccess?: (data: any) => void,
  onFailed?: (code: number) => void
) => {
  const [formRegisters, setFormRegisters] = useState<
    { name: string; validations?: validationRules }[]
  >([]);
  const [formValues, setFormValues] = useState<{ name: string; value?: any }[]>(
    []
  );
  const [formErrors, setFormErrors] = useState<{ name: string; error?: any }[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const onChange = (name: string, value?: any) => {
    setFormValues([
      ...formValues.filter((val) => val.name != name),
      { name, value: value || '' },
    ]);
  };

  const formControl = (name: string) => {
    return {
      onChange: (e: any) => onChange(name, e),
      value: formValues.find((val) => val.name == name)?.value || undefined,
      error: formErrors.find((val) => val.name == name)?.error || undefined,
      register: (regName: string, regValidations?: validationRules) => {
        if (!formRegisters.find((reg) => reg.name == regName)) {
          setFormRegisters([
            ...formRegisters.filter((reg) => reg.name != regName),
            { name: regName, validations: regValidations },
          ]);
        }
      },
    };
  };

  const fetch = async () => {
    setLoading(true);

    const formData = new FormData();

    formValues.map((val) => {
      formData.append(val.name, val.value);
    });

    const mutate = await post({
      url: submitControl.url,
      path: submitControl.path,
      bearer: submitControl.bearer,
      body: formData,
    });

    if (mutate?.status == 200 || mutate?.status == 201) {
      setLoading(false);
      onSuccess?.(mutate.data);
      setFormValues([]);
      setFormValues([]);
      setShowConfirm(false);
    } else if (mutate?.status == 422) {
      let errors: { name: string; error?: any }[] = [];

      Object.keys(mutate.data.errors).map((key) => {
        errors.push({
          name: key,
          error: mutate.data.errors[key][0],
        });
      });

      setFormErrors(errors);
      setLoading(false);
    } else {
      onFailed?.(mutate?.status || 500);
      setLoading(false);
    }
  };

  const submit = async (e: any) => {
    e.preventDefault();
    setFormErrors([]);

    const newErrors: { name: string; error?: any }[] = [];

    formRegisters.map((form) => {
      const { valid, message } = validationHelper({
        value: formValues.find((val) => val.name == form.name)?.value,
        rules: form.validations,
      });

      if (!valid) {
        newErrors.push({ name: form.name, error: message });
      }
    });

    if (newErrors.length) {
      setFormErrors(newErrors);
      return;
    }

    if (confirmation) {
      setShowConfirm(true);
    } else {
      fetch();
    }
  };

  const onConfirm = () => {
    fetch();
  };

  const setValues = (values: object) => {
    const newValues: { name: string; value?: any }[] = [];

    Object.keys(values).map((keyName: string) => {
      if (formRegisters.find((form) => form.name == keyName)) {
        newValues.push({
          name: keyName,
          value: values[keyName as keyof object],
        });
      }
    });
    setFormValues(newValues);
  };

  return [
    {
      formControl,
      setValues,
      submit,
      loading,
      confirm: {
        show: showConfirm,
        onConfirm,
        onClose: () => setShowConfirm(false),
      },
    },
  ];
};
