import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Button,
  IconButton,
  useToast,
  Spinner,
  Center,
  Text,
  Select,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Divider,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

function Admin() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const tableHeaderBg = useColorModeValue("gray.50", "gray.700");
  const tableRowHoverBg = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to load users",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "User role updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        loadUsers();
        loadStats();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update role",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast({
          title: "User deleted",
          description: "The user has been removed successfully.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        loadUsers();
        loadStats();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to delete user",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={8} align="stretch">
      {/* Statistics */}
      {stats && (
        <Card shadow="lg">
          <CardHeader>
            <Heading as="h3" size="md" color="brand.700">
              System Statistics
            </Heading>
          </CardHeader>
          <Divider />
          <CardBody>
            <StatGroup>
              <Stat>
                <StatLabel>Total Users</StatLabel>
                <StatNumber>{stats.totalUsers}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Total Admins</StatLabel>
                <StatNumber>{stats.totalAdmins}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Total Check-ins</StatLabel>
                <StatNumber>{stats.totalCheckins}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Check-ins Today</StatLabel>
                <StatNumber>{stats.checkinsToday}</StatNumber>
              </Stat>
            </StatGroup>
          </CardBody>
        </Card>
      )}

      {/* User Management */}
      <Card shadow="lg">
        <CardHeader>
          <Heading as="h3" size="md" color="brand.700">
            User Management
          </Heading>
          <Text mt={2} color="gray.600">
            Manage user accounts and roles
          </Text>
        </CardHeader>
        <Divider />
        <CardBody>
          {isLoading ? (
            <Center py={10}>
              <VStack spacing={4}>
                <Spinner size="xl" color="brand.500" thickness="4px" />
                <Text color="gray.600">Loading users...</Text>
              </VStack>
            </Center>
          ) : users.length === 0 ? (
            <Center py={10}>
              <Text fontSize="xl" color="gray.500">
                No users found
              </Text>
            </Center>
          ) : (
            <TableContainer>
              <Table variant="simple" size="md">
                <Thead bg={tableHeaderBg}>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Email</Th>
                    <Th>Name</Th>
                    <Th>Role</Th>
                    <Th>Created</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user.id} _hover={{ bg: tableRowHoverBg }}>
                      <Td fontWeight="semibold">{user.id}</Td>
                      <Td>{user.email}</Td>
                      <Td>
                        {user.first_name} {user.last_name}
                      </Td>
                      <Td>
                        <Select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          size="sm"
                          width="120px"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </Select>
                      </Td>
                      <Td color="gray.600">
                        {new Date(user.created_at).toLocaleDateString("en-GB")}
                      </Td>
                      <Td>
                        <IconButton
                          icon={<DeleteIcon />}
                          onClick={() => handleDeleteUser(user.id)}
                          colorScheme="red"
                          size="sm"
                          aria-label={`Delete user ${user.email}`}
                          title="Delete user"
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </CardBody>
      </Card>
    </VStack>
  );
}

export default Admin;
