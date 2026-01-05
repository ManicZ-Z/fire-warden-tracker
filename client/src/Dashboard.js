import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  Badge,
  IconButton,
  Flex,
  Text,
  useColorModeValue,
  Divider,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";

function Dashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState(0);
  const [locations, setLocations] = useState([]);
  const [staffNumber, setStaffNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [checkins, setCheckins] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCheckins, setIsLoadingCheckins] = useState(false);

  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.700");
  const tableRowHoverBg = useColorModeValue("gray.50", "gray.700");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/locations", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
        if (data.length > 0) setLocation(data[0]);
      })
      .catch((err) => {
        console.error("Failed to load locations:", err);
        toast({
          title: "Error loading locations",
          description: "Could not fetch available locations from the server.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }, [toast]);

  const loadCheckins = () => {
    setIsLoadingCheckins(true);
    const token = localStorage.getItem("token");
    fetch("/api/checkins", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setCheckins(data);
        setIsLoadingCheckins(false);
      })
      .catch((err) => {
        console.error("Failed to load check-ins:", err);
        setIsLoadingCheckins(false);
        toast({
          title: "Error loading check-ins",
          description: "Could not fetch check-in data from the server.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    if (view === 1) {
      loadCheckins();
    }
  }, [view]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (!staffNumber || !firstName || !lastName || !location) {
      setMessage("All fields are required");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    try {
      const url = editingId ? `/api/checkins/${editingId}` : "/api/checkins";
      const method = editingId ? "PUT" : "POST";
      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ staffNumber, firstName, lastName, location }),
      });

      if (response.ok) {
        const successMessage = editingId
          ? "Check-in updated successfully!"
          : "Check-in submitted successfully!";

        toast({
          title: "Success",
          description: successMessage,
          status: "success",
          duration: 4000,
          isClosable: true,
        });

        setStaffNumber("");
        setFirstName("");
        setLastName("");
        setLocation(locations[0] || "");
        setEditingId(null);
        setMessage("");
      } else {
        const error = await response.json();
        setMessage(error.error || "An error occurred");
        setMessageType("error");
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (checkin) => {
    setStaffNumber(checkin.staff_number);
    setFirstName(checkin.first_name);
    setLastName(checkin.last_name);
    setLocation(checkin.location);
    setEditingId(checkin.id);
    setView(0);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setStaffNumber("");
    setFirstName("");
    setLastName("");
    setLocation(locations[0] || "");
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this check-in?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/checkins/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadCheckins();
        toast({
          title: "Check-in deleted",
          description: "The check-in has been removed successfully.",
          status: "info",
          duration: 4000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete check-in.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: `Error: ${err.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Box
        as="header"
        bg="brand.700"
        color="white"
        py={6}
        mb={8}
        boxShadow="md"
      >
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Box>
              <Heading as="h1" size="xl" fontWeight="bold">
                Fire Warden Tracker
              </Heading>
              <Text mt={2} fontSize="lg" opacity={0.9}>
                University of Winchester Campus Safety System
              </Text>
            </Box>
            <Button onClick={handleLogout} colorScheme="whiteAlpha" variant="outline">
              Logout
            </Button>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" pb={10}>
        <Tabs
          index={view}
          onChange={setView}
          colorScheme="brand"
          variant="enclosed"
          isLazy
        >
          <TabList mb={6} borderColor={borderColor}>
            <Tab
              fontWeight="semibold"
              _selected={{
                color: "brand.700",
                borderColor: "brand.700",
                borderBottomColor: bgColor,
              }}
              _focus={{
                boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)",
              }}
            >
              Check-In
            </Tab>
            <Tab
              fontWeight="semibold"
              _selected={{
                color: "brand.700",
                borderColor: "brand.700",
                borderBottomColor: bgColor,
              }}
              _focus={{
                boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)",
              }}
            >
              Dashboard
            </Tab>
          </TabList>

          <TabPanels>
            {/* Check-In Panel */}
            <TabPanel>
              <Card
                bg={bgColor}
                borderColor={borderColor}
                borderWidth="1px"
                shadow="lg"
              >
                <CardHeader>
                  <Heading as="h2" size="lg" color="brand.700">
                    {editingId ? "Edit Check-In" : "Fire Warden Check-In"}
                  </Heading>
                  <Text mt={2} color="gray.600">
                    {editingId
                      ? "Update your location information"
                      : "Log your working location for today"}
                  </Text>
                </CardHeader>
                <Divider />
                <CardBody>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={6} align="stretch">
                      <FormControl isRequired>
                        <FormLabel htmlFor="staff-number" fontWeight="semibold">
                          Staff Number
                        </FormLabel>
                        <Input
                          id="staff-number"
                          type="text"
                          value={staffNumber}
                          onChange={(e) => setStaffNumber(e.target.value)}
                          placeholder="Enter your staff number"
                          size="lg"
                          focusBorderColor="brand.500"
                          aria-required="true"
                          aria-describedby="staff-number-help"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel htmlFor="first-name" fontWeight="semibold">
                          First Name
                        </FormLabel>
                        <Input
                          id="first-name"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter your first name"
                          size="lg"
                          focusBorderColor="brand.500"
                          aria-required="true"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel htmlFor="last-name" fontWeight="semibold">
                          Last Name
                        </FormLabel>
                        <Input
                          id="last-name"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Enter your last name"
                          size="lg"
                          focusBorderColor="brand.500"
                          aria-required="true"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel htmlFor="location" fontWeight="semibold">
                          Working Location
                        </FormLabel>
                        <Select
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          size="lg"
                          focusBorderColor="brand.500"
                          aria-required="true"
                        >
                          {locations.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      {message && (
                        <Alert
                          status={messageType}
                          borderRadius="md"
                          role="alert"
                        >
                          <AlertIcon />
                          <Box>
                            <AlertTitle>
                              {messageType === "error" ? "Error" : "Success"}
                            </AlertTitle>
                            <AlertDescription>{message}</AlertDescription>
                          </Box>
                        </Alert>
                      )}

                      <HStack spacing={4}>
                        <Button
                          type="submit"
                          colorScheme="green"
                          size="lg"
                          leftIcon={<CheckIcon />}
                          isLoading={isLoading}
                          loadingText="Submitting..."
                          flex={1}
                          aria-label={
                            editingId ? "Update check-in" : "Submit check-in"
                          }
                        >
                          {editingId ? "Update Check-In" : "Submit Check-In"}
                        </Button>
                        {editingId && (
                          <Button
                            type="button"
                            onClick={handleCancelEdit}
                            colorScheme="gray"
                            size="lg"
                            leftIcon={<CloseIcon />}
                            flex={1}
                            aria-label="Cancel editing"
                          >
                            Cancel
                          </Button>
                        )}
                      </HStack>
                    </VStack>
                  </form>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Dashboard Panel */}
            <TabPanel>
              <Card
                bg={bgColor}
                borderColor={borderColor}
                borderWidth="1px"
                shadow="lg"
              >
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Heading as="h2" size="lg" color="brand.700">
                        Fire Warden Dashboard
                      </Heading>
                      <Text mt={2} color="gray.600">
                        Current fire warden locations across all campuses
                      </Text>
                    </Box>
                    <Badge
                      colorScheme="brand"
                      fontSize="lg"
                      px={4}
                      py={2}
                      borderRadius="full"
                    >
                      {checkins.length} Active
                    </Badge>
                  </Flex>
                </CardHeader>
                <Divider />
                <CardBody>
                  {isLoadingCheckins ? (
                    <Center py={10}>
                      <VStack spacing={4}>
                        <Spinner
                          size="xl"
                          color="brand.500"
                          thickness="4px"
                        />
                        <Text color="gray.600">Loading check-ins...</Text>
                      </VStack>
                    </Center>
                  ) : checkins.length === 0 ? (
                    <Center py={10}>
                      <VStack spacing={4}>
                        <Text fontSize="xl" color="gray.500">
                          No check-ins recorded yet
                        </Text>
                        <Text color="gray.400">
                          Fire wardens will appear here once they check in
                        </Text>
                      </VStack>
                    </Center>
                  ) : (
                    <TableContainer>
                      <Table
                        variant="simple"
                        size="md"
                        aria-label="Fire warden check-ins table"
                      >
                        <Thead bg={tableHeaderBg}>
                          <Tr>
                            <Th>Staff Number</Th>
                            <Th>Name</Th>
                            <Th>Location</Th>
                            <Th>Check-In Time</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {checkins.map((checkin) => (
                            <Tr
                              key={checkin.id}
                              _hover={{ bg: tableRowHoverBg }}
                            >
                              <Td fontWeight="semibold">{checkin.staff_number}</Td>
                              <Td>
                                {checkin.first_name} {checkin.last_name}
                              </Td>
                              <Td>
                                <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
                                  {checkin.location}
                                </Badge>
                              </Td>
                              <Td color="gray.600">
                                {new Date(checkin.check_in_time).toLocaleString(
                                  "en-GB",
                                  {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  }
                                )}
                              </Td>
                              <Td>
                                <HStack spacing={2}>
                                  <IconButton
                                    icon={<EditIcon />}
                                    onClick={() => handleEdit(checkin)}
                                    colorScheme="blue"
                                    size="sm"
                                    aria-label={`Edit check-in for ${checkin.first_name} ${checkin.last_name}`}
                                    title="Edit check-in"
                                  />
                                  <IconButton
                                    icon={<DeleteIcon />}
                                    onClick={() => handleDelete(checkin.id)}
                                    colorScheme="red"
                                    size="sm"
                                    aria-label={`Delete check-in for ${checkin.first_name} ${checkin.last_name}`}
                                    title="Delete check-in"
                                  />
                                </HStack>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  )}
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
}

export default Dashboard;
