import { type FC } from "react";
import { useForm, type UseFormProps } from "react-hook-form";
import {
  Button,
  Card,
  CardContent,
  Fade,
  Stack,
  TextField,
  Typography,
  type StackProps,
} from "@mui/material";
import { addDoc, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { customerCollection } from "@/firebase/collections";
import type { CustomerData } from "@/types/global";

interface CustomerForm
  extends Omit<StackProps, "onSuccess" | "onError">,
    UseFormProps<CustomerData> {
  customer?: QueryDocumentSnapshot<CustomerData>;
  onSuccess?: (docId: string) => void;
  onError?: (error: Error) => void;
}

const CustomerForm: FC<CustomerForm> = ({
  customer,
  onSuccess,
  onError,
  ...props
}) => {
  /** Values */

  const isEditForm = !!customer;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty, isValid, disabled },
  } = useForm<CustomerData>({ values: customer?.data(), ...props });

  /** Callbacks */

  const onSubmit: StackProps["onSubmit"] = handleSubmit(async (data) => {
    try {
      if (isEditForm) {
        await updateDoc(customer.ref, { ...data });
        onSuccess?.(customer.id);
      } else {
        const customerRef = await addDoc(customerCollection, data);
        onSuccess?.(customerRef.id);
      }
    } catch (error) {
      onError?.(error as Error);
    }
  });

  const onReset: StackProps["onReset"] = (event) => {
    event.preventDefault();
    reset();
  };

  return (
    <Stack
      component="form"
      spacing={1}
      onSubmit={onSubmit}
      onReset={onReset}
      {...props}
    >
      <Typography variant="h6">
        {isEditForm ? "Edit" : "Create"} Customer
      </Typography>

      <Card>
        <CardContent component={Stack} spacing={1}>
          <TextField
            type="text"
            label="Name"
            {...register("name", { required: true, maxLength: 128, disabled })}
          />
          <TextField
            type="email"
            label="Email"
            {...register("email", { required: true, maxLength: 128, disabled })}
          />
          <TextField
            type="text"
            label="Address"
            {...register("address", {
              required: true,
              maxLength: 130,
              disabled,
            })}
          />
          <TextField
            type="tel"
            label="Phone"
            {...register("phone", { required: true, maxLength: 16, disabled })}
          />
        </CardContent>
      </Card>

      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Fade in={isEditForm && isDirty}>
          <Button
            type="reset"
            variant="outlined"
            color="error"
            disabled={isSubmitting || disabled}
          >
            Reset
          </Button>
        </Fade>
        <Button
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={!isDirty || !isValid || disabled}
        >
          {isEditForm ? "Update" : "Create"}
        </Button>
      </Stack>
    </Stack>
  );
};

export default CustomerForm;
