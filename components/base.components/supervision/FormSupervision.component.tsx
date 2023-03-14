import {
  faCheckDouble,
  faExclamationTriangle,
  faQuestionCircle,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { useForm } from '../../../helpers';
import { ButtonComponent } from '../button';
import {
  inputCheckboxProps,
  InputComponent,
  InputDateComponent,
  inputDateProps,
  InputFileComponent,
  inputFileProps,
  inputImageProps,
  InputMapComponent,
  inputMapProps,
  InputNumberComponent,
  inputNumberProps,
  inputProps,
  inputRadioProps,
  InputTimeComponent,
  inputTimeProps,
  SelectComponent,
  selectProps,
} from '../input';
import InputImageComponent from '../input/InputImage.component';
import { ModalConfirmComponent } from '../modal';
import { formSupervisionProps } from './form-supervision.props';

export function FormSupervisionComponent({
  title,
  forms,
  submitControl,
  confirmation,
  defaultValue,
  onSuccess,
  customActionBar,
}: formSupervisionProps) {
  const [modalFailed, setModalFailed] = useState<boolean>(false);
  const [modalSuccess, setModalSuccess] = useState<boolean>(false);
  const [fresh, setFresh] = useState<boolean>(true);

  const success = () => {
    onSuccess?.();
    setModalSuccess(true);
    setFresh(false);
    setTimeout(() => {
      setFresh(true);
    }, 500);
  };

  const onFailed = () => {
    setModalFailed(true);
  };

  const [{ formControl, setValues, submit, loading, confirm }] = useForm(
    submitControl,
    confirmation,
    success,
    onFailed
  );

  useEffect(() => {
    if (defaultValue) {
      setValues(defaultValue);
    }
  }, [defaultValue]);

  return (
    <>
      {title && <h4 className="text-lg font-semibold mb-4">{title}</h4>}

      <form className="grid grid-cols-12 gap-8" onSubmit={submit}>
        {fresh &&
          forms.map((form, key) => {
            const inputType = form.type || 'default';
            return (
              <div
                style={{
                  gridColumn: `span ${form?.col ? form.col : '12'} / span ${
                    form?.col ? form.col : '12'
                  }`,
                }}
                key={key}
              >
                {inputType == 'custom' ? (
                  <>{form.custom?.()}</>
                ) : inputType == 'select' ? (
                  <SelectComponent
                    {...(form.construction as selectProps)}
                    {...formControl(form.construction?.name || 'input_name')}
                  />
                ) : inputType == 'date' ? (
                  <InputDateComponent
                    {...(form.construction as inputDateProps)}
                    {...formControl(form.construction?.name || 'input_name')}
                  />
                ) : inputType == 'file' ? (
                  <InputFileComponent
                    {...(form.construction as inputFileProps)}
                    {...formControl(form.construction?.name || 'input_name')}
                  />
                ) : inputType == 'image' ? (
                  <InputImageComponent
                    {...(form.construction as inputImageProps)}
                    {...formControl(form.construction?.name || 'input_name')}
                  />
                ) : inputType == 'time' ? (
                  <InputTimeComponent
                    {...(form.construction as inputTimeProps)}
                    {...formControl(form.construction?.name || 'input_name')}
                  />
                ) : inputType == 'number' ? (
                  <InputNumberComponent
                    {...(form.construction as inputNumberProps)}
                    {...formControl(form.construction?.name || 'input_name')}
                  />
                ) : inputType == 'check' ? (
                  <InputNumberComponent
                    {...(form.construction as inputCheckboxProps)}
                    {...formControl(form.construction?.name || 'input_name')}
                  />
                ) : inputType == 'radio' ? (
                  <InputNumberComponent
                    {...(form.construction as inputRadioProps)}
                    {...formControl(form.construction?.name || 'input_name')}
                  />
                ) : inputType == 'map' ? (
                  <InputMapComponent
                    {...(form.construction as inputMapProps)}
                    {...formControl(form.construction?.name || 'input_name')}
                  />
                ) : (
                  <InputComponent
                    {...(form.construction as inputProps)}
                    {...formControl(form.construction?.name || 'input_name')}
                  />
                )}
              </div>
            );
          })}

        <div className="col-span-12">
          {customActionBar ? (
            customActionBar
          ) : (
            <>
              <div className="flex justify-end">
                <ButtonComponent
                  type="submit"
                  label="Simpan"
                  icon={faSave}
                  loading={loading}
                />
              </div>
            </>
          )}
        </div>
      </form>

      <ModalConfirmComponent
        show={modalSuccess}
        onClose={() => setModalSuccess(false)}
        paint="success"
        icon={faCheckDouble}
        title="Berhasil"
        tip="Data berhasil di simpan"
        submitButton={{
          label: 'Selesai',
        }}
        onSubmit={() => setModalSuccess(false)}
      />

      <ModalConfirmComponent
        show={modalFailed}
        onClose={() => setModalFailed(false)}
        paint="danger"
        icon={faExclamationTriangle}
        title="Gagal"
        tip="Data gagal di simpan, cek data dan koneksi internet dan coba kembali!"
        submitButton={{
          label: 'Oke, Mengerti',
        }}
        onSubmit={() => setModalFailed(false)}
      />

      <ModalConfirmComponent
        show={confirm.show}
        onClose={() => confirm.onClose()}
        paint="warning"
        icon={faQuestionCircle}
        title="Yakin"
        tip="Apakah data yang di masukkan sudah benar?"
        onSubmit={() => confirm.onConfirm()}
        submitButton={{
          label: 'Ya',
          loading: loading,
        }}
      />
    </>
  );
}
