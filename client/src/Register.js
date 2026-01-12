import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Card,
  CardHeader,
  CardBody,
  Alert,
  AlertIcon,
  AlertDescription,
  Text,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const bgColor = useColorModeValue("white", "gray.800");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password || !firstName || !lastName) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to main app
        navigate("/");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")} py={10}>
      <Box bg="brand.700" color="white" py={6} mb={8} boxShadow="md">
        <Container maxW="container.xl">
          <Heading as="h1" size="xl" fontWeight="bold">
            Fire Warden Tracker
          </Heading>
          <Text mt={2} fontSize="lg" opacity={0.9}>
            University of Winchester Campus Safety System
          </Text>
        </Container>
      </Box>

      <Container maxW="md">
        <Card bg={bgColor} shadow="lg">
          <CardHeader>
            <Heading as="h2" size="lg" color="brand.700">
              Register
            </Heading>
            <Text mt={2} color="gray.600">
              Create a new account
            </Text>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <FormControl isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    size="lg"
                    focusBorderColor="brand.500"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    size="lg"
                    focusBorderColor="brand.500"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    size="lg"
                    focusBorderColor="brand.500"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    size="lg"
                    focusBorderColor="brand.500"
                  />
                </FormControl>

                {error && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  isLoading={isLoading}
                  loadingText="Creating account..."
                >
                  Create Account
                </Button>

                <Text textAlign="center" color="gray.600">
                  Already have an account?{" "}
                  <Link as={RouterLink} to="/login" color="brand.500" fontWeight="semibold">
                    Login here
                  </Link>
                </Text>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}

export default Register;
