import {
  Alert,
  Box,
  Container,
  Input,
  Select,
  Stack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Stat,
  StatLabel,
  StatNumber,
  Th,
  Td,
  Button,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { Camera, Trash } from "react-feather";
import FormInput from "./components/Input";
import { Invoice, ItemLine } from "./interfaces/invoice";
import "./styles/InvoiceLayout.scss";
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "./config/firebase";
import STATES from "./utils/states.json";
import { initialInvoice, initialItemLine } from "./utils/data";
import { ToWords } from 'to-words';

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
  }
})


const InvoiceLayout: React.FC = () => {
  let fileInputRef = useRef<HTMLInputElement | null>(null);
  const [invoice, setInvoice] = useState<Invoice>({ ...initialInvoice });
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadError, setError] = useState<string>("");
  const [total, setTotal] = useState<number>(0.0);
  const [subTotal, setSubtotal] = useState<number>(0.0);
  
  const handleInputClick = () => fileInputRef.current?.click();

  const handleLogoDelete = () => {
    const logoRef = ref(storage, invoice.logo)
    deleteObject(logoRef).then(() => {
      setInvoice({...invoice, logo:''})
    }).catch((error) => {
      console.log(error)
    })
  }


  const handleChange = (name: keyof Invoice, value: string | number) => {
    if (
      name !== "items" &&
      name !== "invoiceTotal" &&
      name !== "invoiceSubtotal"
    ) {
      const newInvoice = { ...invoice };
      if (name === "invoiceNumber" && typeof value === "string") {
        newInvoice[name] = value === '' ? 0 : parseInt(value);
      } else if (name === "invoiceTax" && typeof value === "string") {
        newInvoice[name] = value === "" ? 0 : parseFloat(value);
      } else if (
        name !== "invoiceNumber" &&
        name !== "invoiceTax" &&
        typeof value === "string"
      ) {
        newInvoice[name] = value;
      }

      setInvoice(newInvoice);
    }
  };

  useEffect(() => {
    console.log(invoice)
  }, [invoice])

  const handleInputLineChange = (
    itemIndex: number,
    name: keyof ItemLine,
    value: string
  ) => {
    const items = invoice.items.map((item, i) => {
      if (i === itemIndex) {
        const newitemLine = { ...item };

        if (name === "itemName") {
          newitemLine[name] = value;
        } else {
          if (name === "itemQuantity") {
            newitemLine[name] = value === "" ? 0 : parseInt(value);
            newitemLine.Amount =
              newitemLine.itemQuantity * newitemLine.itemRate;
          } else if (name === "itemRate") {
            newitemLine[name] = value === "" ? 0 : parseInt(value);
            newitemLine.Amount =
              newitemLine.itemQuantity * newitemLine.itemRate;
          }
        }

        console.log(newitemLine);

        return newitemLine;
      }

      return { ...item };
    });

    setInvoice({ ...invoice, items });
  };

  const handleAddNewItem = () => {
    const items = [...invoice.items, { ...initialItemLine }];

    setInvoice({ ...invoice, items });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const storageRef = ref(storage, "logos/" + e.target.files![0]);
    const metadata = {
      contentType: "image/jpeg",
    };
    const uploadTask = uploadBytesResumable(
      storageRef,
      e.target.files![0],
      metadata
    );
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress)
        setUploading(true)
      },
      (error) => {
        setError(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInvoice({ ...invoice, logo: downloadURL });
          setUploading(false)
        });
      }
    );
  };

  const handleDeleteItem = (itemIndex: number) => {
    const items = invoice.items.filter((item, i) => i !== itemIndex);

    setInvoice({ ...invoice, items });
  };

  useEffect(() => {
    let subTotal = 0;

    invoice.items.forEach((item) => {
      subTotal += item.Amount;
    });

    setSubtotal(subTotal);
    setInvoice({...invoice, invoiceSubtotal: subTotal})
  }, [invoice.items]);

  useEffect(() => {
    let total = 0;
    let tax = (subTotal * invoice.invoiceTax) / 100;
    total = subTotal + tax;
    setTotal(total);
    setInvoice({...invoice, invoiceTotal: total})
  }, [subTotal, invoice.invoiceTax]);

  return (
    <div className="invoice_layout">
      <Container maxW="container.xl">
        <Stack
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
          className="invoice_basic_details"
        >
          <FormInput
            value={invoice.invoiceDate}
            onChange={(value) => handleChange("invoiceDate", value)}
            type="date"
            label="Invoice Date"
          ></FormInput>
          <FormInput
            type="number"
            value={invoice.invoiceNumber}
            onChange={(value) => {
              handleChange("invoiceNumber", value);
            }}
            label="Invoice No"
          ></FormInput>
          <FormInput
            type="date"
            value={invoice.invoiceDueDate}
            onChange={(value) => handleChange("invoiceDueDate", value)}
            label="Due Date"
          ></FormInput>
        </Stack>
        <Stack
          direction={{ base: "column", md: "row" }}
          className="invoice_company_details"
        >
          <Box>
          {invoice.logo !== '' && <Button
                size="sm"
                colorScheme="red"
                onClick={handleLogoDelete}
                padding='10px'
                position='absolute'
              >
                <Trash size='15px'/>
              </Button>}
          <Box className="img_upload">
            <Button size='sm' position='absolute' left='100%' colorScheme='red'>Delete Logo</Button>
            {invoice.logo && <img src={invoice.logo} alt="logo"></img>}
            {uploading || invoice.logo === '' && <Camera className="upload_icon" onClick={handleInputClick} />}
            {uploading && <Spinner  color="gray.900" />}
            <Input
              accept="image/*"
              ref={fileInputRef}
              type="file"
              hidden
              onChange={handleFileUpload}
            ></Input>
          </Box>
          {uploadError && <Alert>{uploadError}</Alert>}
          </Box>
          <Text fontSize="xl">Tax Invoice</Text>
        </Stack>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justifyContent="space-between"
        >
          <Stack spacing={4} marginBottom="50px">
            <Text fontSize="md">From Address</Text>
            <FormInput
              value={invoice.companyAddress}
              onChange={(value) => handleChange("companyAddress", value)}
              type="text"
              label="Address Line 1"
            ></FormInput>
            <FormInput
              value={invoice.companyAddress2}
              onChange={(value) => handleChange("companyAddress2", value)}
              type="text"
              label="Address Line 2"
            ></FormInput>
            <div>
              <label htmlFor="state_select">State:</label>
              <Select
                onChange={(e) => handleChange("companyState", e.target.value)}
              >
                {STATES.map((state) => (
                  <option key={state.code} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </Select>
            </div>
          </Stack>
          <Stack spacing={4} marginBottom="50px">
            <Text fontSize="md">To Address</Text>
            <FormInput
              value={invoice.clientAddress}
              onChange={(value) => handleChange("clientAddress", value)}
              type="text"
              label="Address Line 1"
            ></FormInput>
            <FormInput
              value={invoice.clientAddress2}
              onChange={(value) => handleChange("clientAddress2", value)}
              type="text"
              label="Address Line 2"
            ></FormInput>
            <div>
              <label htmlFor="state_select">State:</label>
              <Select
                onChange={(e) => handleChange("clientState", e.target.value)}
              >
                {STATES.map((state) => (
                  <option key={state.code} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </Select>
            </div>
          </Stack>
        </Stack>
        <Box border="1px" borderColor="gray.200" overflow="scroll" padding={4}>
          <Table>
            <Thead>
              <Tr>
                <Th>Item Name</Th>
                <Th>Item Rate</Th>
                <Th>Item Quantity</Th>
                <Th>Amount</Th>
              </Tr>
            </Thead>
            <Tbody>
              {invoice.items.length !== 0 &&
                invoice.items.map((item, i) => (
                  <Tr key={i} justifyContent="center" alignItems="center">
                    <Td>
                      <Input
                        value={item.itemName}
                        name="itemName"
                        variant="flushed"
                        onChange={(e) =>
                          handleInputLineChange(i, "itemName", e.target.value)
                        }
                      ></Input>
                    </Td>
                    <Td>
                      <Input
                        value={item.itemRate}
                        name="itemRate"
                        variant="flushed"
                        onChange={(e) =>
                          handleInputLineChange(i, "itemRate", e.target.value)
                        }
                      ></Input>
                    </Td>
                    <Td>
                      <Input
                        value={item.itemQuantity}
                        name="itemQuantity"
                        variant="flushed"
                        onChange={(e) =>
                          handleInputLineChange(
                            i,
                            "itemQuantity",
                            e.target.value
                          )
                        }
                      ></Input>
                    </Td>
                    <Td>
                      <Input
                        value={item.Amount}
                        disabled
                        variant="flushed"
                        name="Amount"
                        type="number"
                      ></Input>
                    </Td>
                    <IconButton
                      colorScheme="red"
                      margin="20px 0px"
                      icon={<Trash />}
                      aria-label="remove_icon"
                      onClick={() => handleDeleteItem(i)}
                    />
                  </Tr>
                ))}
              <Tr></Tr>
            </Tbody>
          </Table>
        </Box>
        <Button
          colorScheme="green"
          margin="10px 0px"
          onClick={handleAddNewItem}
        >
          Add New Item
        </Button>
      </Container>
      <Stack
        border="1px"
        borderColor="gray.200"
        rounded="md"
        padding={4}
        spacing={4}
        className="invoice_tally"
      >
        <Stat>
          <StatLabel>Subtotal</StatLabel>
          <StatNumber>₹{subTotal}.00</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Tax</StatLabel>
          <Input
            w='xsm'
            type="number"
            value={invoice.invoiceTax || ''}
            onChange={(e) => handleChange("invoiceTax", e.target.value)}
          ></Input> %
        </Stat>
        <Stat>
          <StatLabel>Total</StatLabel>
          <StatNumber>₹{total}.00</StatNumber>
        </Stat>
        <Text fontSize='sm'>{total !== 0 ? toWords.convert(total) : null}</Text>
      </Stack>
    </div>
  );
};

export default InvoiceLayout;
