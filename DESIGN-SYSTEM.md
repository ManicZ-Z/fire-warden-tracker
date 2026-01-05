# Fire Warden Tracker - Design System

## Overview
This application uses **Chakra UI** - a modern, accessible React component library that provides a consistent design language and built-in accessibility features.

---

## Design Principles

### 1. Accessibility First
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
- Clear focus indicators

### 2. Clean & Modern
- Card-based layouts
- Generous white space
- Clear visual hierarchy
- Consistent spacing and sizing

### 3. Professional
- University branding-friendly
- Professional color palette
- Clear typography
- Institutional-appropriate styling

### 4. Responsive
- Mobile-friendly design
- Touch-optimized buttons (minimum 44x44px)
- Scrollable tables on small screens
- Responsive containers

---

## Color Palette

### Primary Brand Colors
Defined in `client/src/index.js:10-22`

```javascript
brand: {
  50: '#e3f2fd',   // Lightest - backgrounds
  100: '#bbdefb',
  200: '#90caf9',
  300: '#64b5f6',
  400: '#42a5f5',
  500: '#2196f3',  // Base brand color
  600: '#1e88e5',
  700: '#1976d2',  // Primary header color
  800: '#1565c0',
  900: '#0d47a1',  // Darkest - emphasis
}
```

### Semantic Colors

| Color | Usage | Example |
|-------|-------|---------|
| `brand.700` | Primary headers, main branding | Header background |
| `green.500` | Success actions | Submit button |
| `red.500` | Destructive actions | Delete button |
| `blue.500` | Edit actions | Edit button |
| `gray.50` | Page background | Body background |
| `gray.800` | Primary text | Body text |
| `gray.600` | Secondary text | Descriptions |

### Status Colors
- **Success**: Green (`green.500`, `green.600`)
- **Error**: Red (`red.500`, `red.600`)
- **Info**: Blue (`blue.500`, `blue.600`)
- **Warning**: Orange (`orange.500`, `orange.600`)

---

## Typography

### Headings
```
H1 (Heading size="xl"): Page title "Fire Warden Tracker"
H2 (Heading size="lg"): Section headings "Fire Warden Check-In"
```

### Body Text
```
Large Text (fontSize="lg"): Header subtitle
Normal Text (default): Body text, form labels
Small Text (fontSize="sm"): Table data, badges
```

### Font Weights
- **Bold** (`fontWeight="bold"`): Main page heading
- **Semibold** (`fontWeight="semibold"`): Section headings, labels, tab labels
- **Normal** (default): Body text

---

## Spacing System

Chakra UI uses a consistent spacing scale (1 unit = 0.25rem = 4px):

| Prop | Value | Pixels | Usage |
|------|-------|--------|-------|
| `spacing={2}` | 0.5rem | 8px | Tight spacing |
| `spacing={4}` | 1rem | 16px | Normal spacing |
| `spacing={6}` | 1.5rem | 24px | Form field spacing |
| `py={6}` | 1.5rem | 24px | Header padding |
| `mb={8}` | 2rem | 32px | Section margins |

### Component Spacing
```javascript
// Form fields
<VStack spacing={6}> // 24px between fields

// Button groups
<HStack spacing={4}> // 16px between buttons

// Header
<Box py={6}> // 24px top/bottom padding
```

---

## Components

### Layout Components

#### Container
```jsx
<Container maxW="container.xl">
  // Content (1280px max width)
</Container>
```

Usage:
- Constrains content width
- Centers content
- Provides responsive padding

#### Box
Generic container with full styling props:
```jsx
<Box bg="white" p={4} borderRadius="md" shadow="lg">
  // Content
</Box>
```

#### Card
Structured content container:
```jsx
<Card>
  <CardHeader>...</CardHeader>
  <Divider />
  <CardBody>...</CardBody>
</Card>
```

### Form Components

#### FormControl
```jsx
<FormControl isRequired>
  <FormLabel htmlFor="staff-number">Staff Number</FormLabel>
  <Input
    id="staff-number"
    size="lg"
    focusBorderColor="brand.500"
  />
</FormControl>
```

Features:
- Automatic label association
- Required field indicator
- Error state handling
- Accessible by default

#### Input
Sizes: `sm`, `md` (default), `lg`, `xl`

```jsx
<Input
  size="lg"                    // Large for better accessibility
  focusBorderColor="brand.500" // Blue focus ring
  placeholder="Enter text"     // Helpful hint
/>
```

#### Select
```jsx
<Select size="lg" focusBorderColor="brand.500">
  <option value="value">Label</option>
</Select>
```

### Feedback Components

#### Alert
```jsx
<Alert status="success" role="alert">
  <AlertIcon />
  <Box>
    <AlertTitle>Success</AlertTitle>
    <AlertDescription>Message here</AlertDescription>
  </Box>
</Alert>
```

Status types: `success`, `error`, `warning`, `info`

#### Toast
```jsx
toast({
  title: "Success",
  description: "Action completed",
  status: "success",
  duration: 4000,
  isClosable: true,
});
```

Features:
- Non-blocking notifications
- Auto-dismiss after duration
- Manually closable
- Accessible to screen readers

#### Spinner
```jsx
<Spinner
  size="xl"
  color="brand.500"
  thickness="4px"
/>
```

### Data Display

#### Table
```jsx
<TableContainer>
  <Table variant="simple" size="md">
    <Thead bg="gray.50">
      <Tr>
        <Th>Column</Th>
      </Tr>
    </Thead>
    <Tbody>
      <Tr _hover={{ bg: "gray.50" }}>
        <Td>Data</Td>
      </Tr>
    </Tbody>
  </Table>
</TableContainer>
```

Features:
- Scrollable on small screens
- Hover states for rows
- Semantic table structure
- Accessible headers

#### Badge
```jsx
<Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
  Location Name
</Badge>
```

Usage: Status indicators, labels, counts

### Navigation

#### Tabs
```jsx
<Tabs colorScheme="brand" variant="enclosed">
  <TabList>
    <Tab>Check-In</Tab>
    <Tab>Dashboard</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>...</TabPanel>
    <TabPanel>...</TabPanel>
  </TabPanels>
</Tabs>
```

Features:
- Keyboard navigation (arrow keys)
- Clear focus indicators
- Lazy loading panels
- Accessible by default

### Buttons

#### Solid Buttons
```jsx
<Button colorScheme="green" size="lg">
  Submit
</Button>
```

Color schemes: `green`, `blue`, `red`, `gray`, `brand`

#### Icon Buttons
```jsx
<IconButton
  icon={<EditIcon />}
  colorScheme="blue"
  size="sm"
  aria-label="Edit item"
/>
```

Always include `aria-label` for accessibility!

#### Button with Icon
```jsx
<Button leftIcon={<CheckIcon />} colorScheme="green">
  Submit
</Button>
```

---

## Responsive Breakpoints

Chakra UI breakpoints (defined automatically):

| Breakpoint | Min Width | Description |
|------------|-----------|-------------|
| `base` | 0px | Mobile devices |
| `sm` | 30em (480px) | Small tablets |
| `md` | 48em (768px) | Tablets |
| `lg` | 62em (992px) | Small desktops |
| `xl` | 80em (1280px) | Large desktops |
| `2xl` | 96em (1536px) | Extra large screens |

### Responsive Props
```jsx
<Box
  width={{ base: "100%", md: "50%", lg: "33%" }}
  fontSize={{ base: "sm", md: "md", lg: "lg" }}
>
  Content
</Box>
```

---

## Shadows

| Prop | CSS Value | Usage |
|------|-----------|-------|
| `shadow="sm"` | Small shadow | Subtle elevation |
| `shadow="md"` | Medium shadow | Header elevation |
| `shadow="lg"` | Large shadow | Card elevation |
| `shadow="xl"` | Extra large | Modal, popovers |

---

## Border Radius

| Prop | Value | Pixels | Usage |
|------|-------|--------|-------|
| `borderRadius="sm"` | 0.125rem | 2px | Subtle rounding |
| `borderRadius="md"` | 0.375rem | 6px | Alerts, inputs |
| `borderRadius="lg"` | 0.5rem | 8px | Cards |
| `borderRadius="full"` | 9999px | Round | Badges, avatars |

---

## Interactive States

### Hover
```jsx
<Tr _hover={{ bg: "gray.50" }}>
  // Row content
</Tr>
```

### Focus
All interactive elements have focus styles:
```jsx
<Button _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}>
  // Visible focus ring
</Button>
```

### Active
```jsx
<Button _active={{ transform: "scale(0.98)" }}>
  // Subtle press effect
</Button>
```

### Disabled
```jsx
<Button isDisabled>
  // Automatically styled as disabled
</Button>
```

---

## Icons

Using Chakra UI Icons:
```jsx
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";

<EditIcon />
<DeleteIcon />
<CheckIcon />
<CloseIcon />
```

Features:
- Accessible by default
- Consistent sizing
- Color inheritance
- Built-in hover states

---

## Accessibility Features

### Built-in ARIA Support
- FormControl automatically links labels to inputs
- Buttons have proper roles and states
- Tabs have proper keyboard navigation
- Alerts have role="alert" for screen readers

### Focus Management
- Visible focus indicators on all interactive elements
- Focus trap in modals (when used)
- Logical tab order

### Color Contrast
- All color combinations meet WCAG AA
- Text is readable against backgrounds
- Status colors are distinguishable

### Screen Reader Support
- Semantic HTML elements
- Proper ARIA labels on icon buttons
- Live region updates for toasts

---

## Performance Optimizations

### Lazy Loading
```jsx
<Tabs isLazy>
  // Panels only render when selected
</Tabs>
```

### Code Splitting
- Chakra UI components tree-shake automatically
- Only used components are included in bundle

---

## Customization

### Extending Theme
Edit `client/src/index.js` to customize:

```javascript
const theme = extendTheme({
  colors: {
    brand: { /* custom brand colors */ },
  },
  fonts: {
    heading: "Your Font, sans-serif",
    body: "Your Font, sans-serif",
  },
  components: {
    Button: {
      baseStyle: { /* custom button styles */ },
    },
  },
});
```

### University Branding
To match University of Winchester branding:
1. Update brand colors in theme
2. Add university logo to header
3. Adjust font family if needed
4. Update color scheme to match guidelines

---

## Best Practices

### 1. Always Use Semantic Components
```jsx
// ✅ Good
<FormControl>
  <FormLabel>Name</FormLabel>
  <Input />
</FormControl>

// ❌ Bad
<div>
  <div>Name</div>
  <input />
</div>
```

### 2. Provide ARIA Labels for Icon Buttons
```jsx
// ✅ Good
<IconButton icon={<EditIcon />} aria-label="Edit item" />

// ❌ Bad
<IconButton icon={<EditIcon />} />
```

### 3. Use Semantic Color Schemes
```jsx
// ✅ Good
<Button colorScheme="green">Submit</Button>
<Button colorScheme="red">Delete</Button>

// ❌ Bad
<Button bg="green.500">Submit</Button> // Loses semantic meaning
```

### 4. Maintain Consistent Spacing
```jsx
// ✅ Good - using spacing scale
<VStack spacing={6}>

// ❌ Bad - arbitrary values
<VStack spacing="23px">
```

### 5. Use Size Props Consistently
```jsx
// ✅ Good
<Button size="lg">
<Input size="lg">

// ❌ Bad - mixing sizes
<Button size="lg">
<Input size="md">
```

---

## Resources

### Official Documentation
- [Chakra UI Docs](https://chakra-ui.com/)
- [Chakra UI Components](https://chakra-ui.com/docs/components)
- [Chakra UI Theming](https://chakra-ui.com/docs/theming/customize-theme)

### Accessibility
- [Chakra UI Accessibility](https://chakra-ui.com/docs/theming/advanced#accessibility)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Design Inspiration
- [Chakra UI Templates](https://chakra-templates.dev/)
- [Chakra UI Pro](https://pro.chakra-ui.com/) (premium templates)

---

## Migration from Plain HTML/CSS

### Before (Plain HTML/CSS)
```jsx
<div style={{ padding: 24, maxWidth: 600 }}>
  <label>Staff Number</label>
  <input
    style={{ display: "block", width: "100%", padding: 8 }}
  />
</div>
```

### After (Chakra UI)
```jsx
<Container maxW="container.md">
  <FormControl>
    <FormLabel>Staff Number</FormLabel>
    <Input size="lg" />
  </FormControl>
</Container>
```

### Benefits
✅ Better accessibility (built-in ARIA)
✅ Consistent design system
✅ Responsive by default
✅ Theme-aware colors
✅ Less custom CSS to maintain
✅ Better developer experience
✅ Production-tested components
