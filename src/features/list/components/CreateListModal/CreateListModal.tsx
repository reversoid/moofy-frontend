import {
  createList,
  clearState,
  $createListState,
} from '@/models/lists/createList';
import { Form } from '@/shared/ui/Form';
import { Input } from '@/shared/ui/Input';
import TextareaCount from '@/shared/ui/TextareaCount';
import { decreasedPaddingMobile, increasedPaddingBottom } from '@/shared/ui/modalStyles';
import {
  Modal,
  Text,
  Textarea,
  Button,
  Checkbox,
  Loading,
} from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  description: string;
  isPrivate: boolean;
}

interface CreateListModalProps {
  isOpen: boolean;
  setIsOpen: (newValue: boolean) => void;
}

const CreateListModal = ({ isOpen, setIsOpen }: CreateListModalProps) => {
  const {
    register,
    formState: { isValid: isFormValid, errors },
    getValues,
    setValue,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    defaultValues: { isPrivate: false },
    mode: 'onChange',
  });

  const onSubmit = useEvent(createList);
  const onClose = useEvent(clearState);

  const { loading, success } = useStore($createListState);

  const handleClose = () => {
    reset();
    setIsOpen(false);
    onClose();
  };

  useEffect(() => {
    if (!success) {
      return;
    }
    handleClose();
  }, [success]);

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      width="45rem"
    >
      <Modal.Header>
        <Text h3>Создать коллекцию</Text>
      </Modal.Header>
      <Modal.Body css={decreasedPaddingMobile}>
        <Form
          onSubmit={handleSubmit(({ description, isPrivate, name }) =>
            onSubmit({ isPublic: !isPrivate, name, description }),
          )}
          id="create-list-modal-form"
        >
          <Input
            bordered
            fullWidth
            label="Название"
            size="xl"
            placeholder="Название123"
            status={errors.name && 'error'}
            {...register('name', {
              required: { value: true, message: 'Поле не должно быть пустым' },
              maxLength: { value: 32, message: 'Слишком длинное название' },
            })}
          />
          <TextareaCount
            maxLength={400}
            bordered
            size="xl"
            label="Описание"
            placeholder="Ваше описание коллекции"
            {...register('description', {
              maxLength: { value: 400, message: 'Слишком длинное описание' },
            })}
            initialValue={getValues('description')}
          />
          <Checkbox
            color="gradient"
            label="Сделать коллекцию приватной"
            css={{
              '& .nextui-checkbox-text': {
                fontSize: '$lg',
              },
            }}
            size='lg'
            {...register('isPrivate')}
            defaultSelected={getValues().isPrivate}
            onChange={(newValue) => setValue('isPrivate', newValue)}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer css={{...decreasedPaddingMobile, ...increasedPaddingBottom}}>
        <Button
          form="create-list-modal-form"
          type="submit"
          size="lg"
          disabled={!isFormValid}
          color={'gradient'}
          auto
          css={{
            minWidth: '7.5rem',
            m: 0,
            '@xsMax': {
              width: '100%',
            },
          }}
        >
          {loading ? (
            <Loading size="lg" type="points" color="white" />
          ) : (
            'Добавить'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateListModal;
