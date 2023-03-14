/* eslint-disable @next/next/no-img-element */
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { destroy, useGet } from '../../../helpers';
import { ButtonComponent } from '../button';
import { tableColumnProps, TableComponent } from '../table';
import { tableSupervisionProps } from './table-supervision.props';
import { formProps } from './form-supervision.props';
import { inputCheckboxProps, inputRadioProps, selectProps } from '../input';
import { FormSupervisionComponent } from './FormSupervision.component';
import { FloatingPageComponent, ModalConfirmComponent } from '../modal';

export function TableSupervisionComponent({
  title,
  fetchControl,
  customTopBar,
  columnControl,
  formControl,
  formUpdateControl,
  actionControl,
}: tableSupervisionProps) {
  const [isError, setIsError] = useState(false);

  const [modalForm, setModalForm] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  // const [modalDeleteSuccess, setModalDeleteSuccess] = useState(false);
  // const [modalDeleteError, setModalDeleteError] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [paginate, setPaginate] = useState(10);
  const [page, setPage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [sort, setSort] = useState<{
    column: string;
    direction: 'desc' | 'asc';
  }>({
    column: 'created_at',
    direction: 'desc',
  });
  const [search, setSearch] = useState<string>('');
  const [searchColumn, setSearchColumn] = useState<string>('');
  const [filter, setFilter] = useState<object[]>([]);

  const [columns, setColumns] = useState<tableColumnProps[]>([]);
  const [dataTable, setDataTable] = useState<object[]>([]);
  const [dataOriginal, setDataOriginal] = useState<object[]>([]);
  const [dataSelected, setDataSelected] = useState<number | null>(null);

  const [forms, setForms] = useState<formProps[]>([]);
  // const [updateForms, setUpdateForms] = useState<formProps[]>([]);

  const [loading, code, data, reset] = useGet({
    ...fetchControl,
    params: {
      page,
      paginate,
      sortBy: sort.column,
      sortDirection: sort.direction,
      search: search,
      filter: filter,
    },
  });

  useEffect(() => {
    if (!loading) {
      if (code == 200 || code == 204) {
        const originalData = data.data;
        let newColumns: tableColumnProps[] = [];
        let newData: object[] = [];

        if (data.totalRow) {
          setTotalRow(data.totalRow);
        }

        if (originalData.length) {
          // if (!columnControl?.custom) {
          Object.keys(originalData.at(0)).map((keyName) => {
            if (
              !columnControl?.except ||
              !columnControl?.except.includes(keyName)
            ) {
              newColumns.push({
                label: keyName.charAt(0).toUpperCase() + keyName.slice(1),
                selector: keyName,
                width: '200px',
                sortable:
                  !columnControl?.exceptSorts ||
                  !columnControl?.exceptSorts.includes(keyName),
              });
            }
          });
          // }

          if (!formControl?.custom) {
            let newForms: formProps[] = [];

            Object.keys(originalData.at(0)).map((keyName) => {
              if (
                !formControl?.except ||
                !formControl?.except.includes(keyName)
              ) {
                let custom =
                  (formControl?.change &&
                    formControl?.change[keyName as keyof object]) ||
                  {};

                newForms.push({
                  type: custom.type ? custom.type : 'default',
                  construction: {
                    label:
                      custom.construction?.label ||
                      keyName.charAt(0).toUpperCase() + keyName.slice(1),
                    name: keyName,
                    placeholder:
                      custom.construction?.placeholder ||
                      'Please enter ' + keyName + '...',
                    options:
                      (
                        custom.construction as
                          | selectProps
                          | inputCheckboxProps
                          | inputRadioProps
                      )?.options || [],
                    validations: custom.construction?.validations || {},
                  },
                });
              }
            });

            if (formControl?.include && formControl?.include?.length) {
              newForms = [...newForms, ...formControl?.include];
            }

            setForms(newForms);
          }

          setColumns(newColumns);

          originalData.map((item: object, key: number) => {
            let items: any = item;

            if (columnControl?.custom) {
              let newItems: any = {};
              columnControl?.custom?.map((column) => {
                newItems[column.selector] = column.item(item);
              });

              items = newItems;
            }

            Object.keys(items).map((keyName) => {
              const mappingIncludeColumns =
                columnControl?.include &&
                columnControl?.include.filter(
                  (newCol) => newCol.before && newCol.before == keyName
                );

              mappingIncludeColumns &&
                mappingIncludeColumns.map((includeColumn) => {
                  if (includeColumn && includeColumn.selector) {
                    items[includeColumn.selector] = includeColumn.item
                      ? includeColumn.item(originalData[key])
                      : null;
                  }
                });

              if (
                columnControl?.change &&
                columnControl?.change[keyName as keyof object]
              ) {
                items[keyName] = columnControl?.change[
                  keyName as keyof object
                ].custom(originalData[key]);

                if (
                  originalData[key][keyName] &&
                  !columnControl.include?.filter(
                    (newCol) => newCol.selector == keyName
                  )[0] &&
                  (typeof originalData[key][keyName] === 'object' ||
                    Array.isArray(originalData[key][keyName]))
                ) {
                  items[keyName] = JSON.stringify(items[keyName]);
                }
              }
            });

            newData.push({
              ...items,
              action: actionControl?.custom ? (
                actionControl?.custom(originalData[key], {
                  setModalView: (e: any) => setModalView(e),
                  setDataSelected: (e: any) => setDataSelected(e),
                  setModalForm: (e: any) => setModalForm(e),
                  setModalDelete: (e: any) => setModalDelete(e),
                })
              ) : (
                <>
                  {actionControl?.include &&
                    actionControl?.include(originalData[key], {
                      setModalView: (e: any) => setModalView(e),
                      setDataSelected: (e: any) => setDataSelected(e),
                      setModalForm: (e: any) => setModalForm(e),
                      setModalDelete: (e: any) => setModalDelete(e),
                    })}

                  {/* {(!actionControl?.except ||
                    !actionControl?.except.includes('detail')) && (
                    <ButtonComponent
                      icon={faEye}
                      label={'Detail'}
                      variant="outline"
                      paint="secondary"
                      size={'xs'}
                      rounded
                      onClick={() => {
                        setModalView(true);
                        setDataSelected(key);
                      }}
                    />
                  )} */}

                  {(!actionControl?.except ||
                    !actionControl?.except.includes('edit')) && (
                    <ButtonComponent
                      icon={faEdit}
                      label={'Ubah'}
                      variant="outline"
                      paint="warning"
                      size={'xs'}
                      rounded
                      onClick={() => {
                        setModalForm(true);
                        setDataSelected(key);
                      }}
                    />
                  )}

                  {(!actionControl?.except ||
                    !actionControl?.except.includes('delete')) && (
                    <ButtonComponent
                      icon={faTrash}
                      label={'Hapus'}
                      variant="outline"
                      paint="danger"
                      size={'xs'}
                      rounded
                      onClick={() => {
                        setModalDelete(true);
                        setDataSelected(key);
                      }}
                    />
                  )}
                </>
              ),
            });
          });

          setDataTable(newData);
          setDataOriginal(originalData);
        }
      } else {
        setIsError(true);
      }
    }
  }, [loading, code, data, columnControl, formControl, actionControl]);

  return (
    <>
      <h1 className="text-xl font-bold mb-4">{title}</h1>

      {!isError ? (
        <TableComponent
          topBar={
            customTopBar ? (
              customTopBar
            ) : (
              <>
                <ButtonComponent
                  label="Add New Data"
                  icon={faPlus}
                  size="sm"
                  onClick={() => setModalForm(true)}
                />
              </>
            )
          }
          columns={
            !columnControl?.custom
              ? columns
              : columnControl?.custom.map((column) => {
                  return {
                    label: column.label || '',
                    selector: column.selector,
                    width: column.width ? column.width : '200px',
                    sortable: column.sortable,
                    filter: column.filter,
                  };
                })
          }
          data={dataTable}
          sortBy={sort}
          onChangeSortBy={(column, direction) => setSort({ column, direction })}
          pagination={{
            page,
            paginate,
            totalRow,
            onChange: (newTotalRow, newPaginate, newPage) => {
              setPaginate(newPaginate);
              setPage(newPage);
            },
          }}
          searchableColumn={columnControl?.searchable || undefined}
          onChangeSearchColumn={(e) => setSearchColumn(e)}
          searchColumn={searchColumn}
          onChangeFilter={(e) => setFilter(e)}
          filter={filter}
          loading={loading}
          onChangeSearch={(e) => setSearch(e)}
          search={search}
          onRefresh={reset}
          onRowClick={(item, key) => {
            setDataSelected(key);
            setModalView(true);
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-8 p-5">
          <img src="/500.svg" width={'350px'} alt="server error" />
          <h1 className="text-2xl font-bold">Server Disconnect</h1>
        </div>
      )}

      <FloatingPageComponent
        title={
          dataSelected === null
            ? 'Tambah ' + title + ' Baru'
            : 'Ubah data ' + title
        }
        tip={'Masukkan data yang valid dan benar!'}
        show={modalForm}
        onClose={() => {
          setModalForm(false);
          setDataSelected(null);
        }}
      >
        <div className="p-6">
          <FormSupervisionComponent
            submitControl={{
              path:
                dataSelected === null
                  ? fetchControl.path
                  : fetchControl.path +
                    '/' +
                    (dataOriginal?.at(dataSelected) as { id: number })?.id,
            }}
            // method={dataSelected === null ? 'post' : 'put'}
            confirmation
            forms={forms}
            defaultValue={
              dataSelected === null
                ? undefined
                : formUpdateControl?.customDefaultValue
                ? formUpdateControl?.customDefaultValue(
                    dataOriginal?.at(dataSelected) || {}
                  )
                : dataOriginal?.at(dataSelected)
            }
            onSuccess={() => {
              setModalForm(false);
              reset();
              setDataSelected(null);
            }}
          />
        </div>
      </FloatingPageComponent>

      <ModalConfirmComponent
        title={'Yakin ingin menghapus ' + title}
        show={modalDelete}
        onClose={() => {
          setModalDelete(false);
          setDataSelected(null);
        }}
        onSubmit={async () => {
          setLoadingDelete(true);

          if (dataSelected !== null) {
            let response = await destroy({
              path:
                fetchControl.path +
                '/' +
                (data?.at(dataSelected) as { id: number }).id,
            });

            if (response?.status == 200 || response?.status == 201) {
              // setModalDeleteError(false);
              setLoadingDelete(false);
              // setModalDeleteSuccess(true);
              setDataSelected(null);
              setModalDelete(false);
            } else {
              // setModalDeleteSuccess(false);
              // setModalDeleteError(true);
              setLoadingDelete(false);
              setModalDelete(false);
            }
          }
        }}
        submitButton={{
          label: 'Ya',
          loading: loadingDelete,
        }}
      />

      <FloatingPageComponent
        title={'Detail ' + title}
        show={modalView}
        onClose={() => {
          setModalView(false);
          setDataSelected(null);
        }}
      >
        <div className="flex flex-col gap-2 p-6">
          {columns.map((column, key) => {
            return (
              <div
                className="flex justify-between gap-4 py-2.5 border-b"
                key={key}
              >
                <h6 className="text-lg">{column.label} :</h6>
                <p className="text-lg font-semibold">
                  {dataSelected && dataOriginal?.at(dataSelected)
                    ? (dataOriginal?.at(dataSelected) as any)[column.selector]
                    : '-'}
                </p>
              </div>
            );
          })}
        </div>
      </FloatingPageComponent>
    </>
  );
}
