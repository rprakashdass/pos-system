# WMS UI Style Guide

This style guide defines the standard layout patterns, components, spacing, and visual design for the WMS application. It should be followed for all new pages and used as a reference when updating existing ones to ensure a consistent UI across the application.

## Page Structure

### Standard Page Layout

All pages should follow this basic structure:

```tsx
<div className="p-6">
  {/* Header Section */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
    <div>
      <h1 className="text-2xl font-bold flex items-center">
        {icon && <Icon size={24} className="mr-2" />}
        Page Title
      </h1>
      <p className="text-muted-foreground mt-1">
        Page description with additional context
      </p>
    </div>
    <div className="mt-4 md:mt-0 flex items-center gap-2">
      {/* Action buttons or filters */}
    </div>
  </div>

  {/* Main Content */}
  <div className="space-y-6">
    {/* Page content goes here */}
  </div>
</div>
```

### Responsive Behavior

- **Mobile views**: Stack header elements vertically
- **Desktop views**: Place title on left, actions on right
- Use `md:` breakpoint (768px) for layout shifts

## Spacing and Sizing

### Standard Spacing Values

- **Page padding**: `p-6`
- **Section margins**: `mb-6` or `space-y-6`
- **Card padding**: `p-4`
- **Grid gap**: `gap-4` (small elements) or `gap-6` (larger sections)
- **Item spacing**: `gap-2` (tight grouping) or `gap-4` (loose grouping)

### Container Max Widths

- Full-width layouts preferred
- For text-heavy pages: `max-w-[1200px] mx-auto`

## Typography

### Headings

- **Page titles**: `text-2xl font-bold`
- **Section titles**: `text-lg font-semibold`
- **Card titles**: `text-base font-medium`
- **Data labels**: `text-sm font-medium`

### Body Text

- **Standard text**: Default font size
- **Supporting text**: `text-sm text-muted-foreground`
- **Notes/captions**: `text-xs text-muted-foreground`

## Color Usage

### Brand and UI Colors

- **Primary actions**: Default Shadcn theme color
- **Secondary actions**: `variant="outline"` with Shadcn
- **Destructive actions**: `variant="destructive"` with Shadcn

### Status Colors

Use consistent status color mapping:

- **Success/Active**: `text-green-500` or `bg-green-100/80`
- **Warning/Pending**: `text-amber-500` or `bg-amber-100/80`
- **Error/Critical**: `text-red-500` or `bg-red-100/80`
- **Info/Progress**: `text-blue-500` or `bg-blue-100/80`
- **Neutral/Inactive**: `text-gray-500` or `bg-gray-100/80`

## Component Standards

### Buttons

- Use Shadcn Button component with appropriate variants
- Primary actions: `<Button>Primary Action</Button>`
- Secondary actions: `<Button variant="outline">Secondary Action</Button>`
- Destructive actions: `<Button variant="destructive">Delete</Button>`
- Button size:
  - Default: `size="default"` for most actions
  - Small: `size="sm"` for inline or compact actions
  - Large: `size="lg"` for prominent primary actions

### Cards

- Use cards to group related content
- Include appropriate padding: `<Card className="p-4">`
- Use `<CardHeader>`, `<CardContent>`, and `<CardFooter>` for structured content

### Tables

- Use Shadcn Table components
- Keep header style consistent with `sticky` behavior for large tables
- Use zebra striping for long tables with many rows

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Forms

- Group related inputs with consistent spacing
- **Use placeholders instead of labels** for a cleaner UI
- Error states should use `text-destructive` for error messages
- Consistent field spacing: `space-y-4`
- **Input widths**: 
  - Avoid excessively wide inputs that span the entire container
  - Use default Shadcn input widths when possible
  - For specific widths, use appropriate sizing:
    - Small inputs (e.g., numeric): `w-24` or `w-32`
    - Medium inputs: `w-64` or `w-80`
    - Contextual width: Use `max-w-[320px]` for most single-line inputs
  - For search inputs in a flex container, use `flex-1` with a parent max-width

```tsx
{/* Good - Using placeholders instead of labels */}
<div className="space-y-4 max-w-[320px]">
  <Input placeholder="Name" />
  <Input placeholder="Quantity" className="w-24" type="number" />
</div>

{/* Search with constrained parent */}
<div className="flex items-center max-w-md">
  <Input
    placeholder="Search..."
    className="flex-1"
  />
  <Button className="ml-2">Search</Button>
</div>
```

### Stats and Metrics

- Use grid layout for multiple stats: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Use cards with consistent sizing
- Include delta indicators with appropriate colors

```tsx
<Card>
  <CardContent className="p-4">
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">Metric Name</span>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold">Value</span>
        <span className="text-sm text-green-500">+10%</span>
      </div>
    </div>
  </CardContent>
</Card>
```

## Tabs and Navigation

- Use Shadcn `<Tabs>` component consistently for page sections
- Tab width should be appropriate to content
- Style active tab clearly with the active state

```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">First Tab</TabsTrigger>
    <TabsTrigger value="tab2">Second Tab</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Tab 1 content</TabsContent>
  <TabsContent value="tab2">Tab 2 content</TabsContent>
</Tabs>
```

## Data Display Patterns

### Lists

- Use consistent list items with appropriate spacing
- For complex data, use a structured layout

### Empty States

- Show helpful messaging and actions
- Include appropriate icons
- Suggest next steps when possible

```tsx
<div className="flex flex-col items-center justify-center p-8 text-center">
  <SomeIcon className="h-12 w-12 text-muted-foreground" />
  <h3 className="mt-4 font-medium">No items found</h3>
  <p className="mt-2 text-sm text-muted-foreground">
    There are no items to display at this time.
  </p>
  <Button className="mt-4">Add Item</Button>
</div>
```

### Loading States

- Use Shadcn `<Skeleton>` for content loading
- Maintain layout during loading to reduce visual jumps

## Icons and Visual Elements

- Use icons consistently from the chosen icon set
- Icon sizes:
  - Nav/small: 16px
  - Standard: 20px 
  - Large/feature: 24px
- Maintain consistent styling (stroke width, color)

## Accessibility Standards

- Use semantic HTML elements
- Maintain sufficient color contrast
- Include focus states for all interactive elements
- Use ARIA attributes when necessary
- Test keyboard navigation

## Examples

### Good Page Header Examples

Good examples to follow:

- Ticket Details

## Specific Components

### Custom QuantityCounter

For quantity adjustments, use a consistent pattern:

```tsx
<div className="flex items-center">
  <Button
    size="icon"
    variant="outline"
    onClick={handleDecrement}
    disabled={quantity <= 1}
  >
    <Minus className="h-4 w-4" />
  </Button>
  <Input
    className="h-9 w-16 text-center mx-1"
    type="text"
    value={quantity}
    onChange={handleChange}
  />
  <Button
    size="icon" 
    variant="outline"
    onClick={handleIncrement}
  >
    <Plus className="h-4 w-4" />
  </Button>
</div>
```

### Status Badges

Use consistent Shadcn `<Badge>` styling with appropriate variants:

```tsx
<Badge variant={getStatusVariant(status)}>
  {status}
</Badge>

// Helper function
function getStatusVariant(status) {
  switch(status) {
    case "Active": return "success";
    case "Pending": return "warning";
    case "Failed": return "destructive";
    default: return "secondary";
  }
}
```

## Implementation Process

When implementing or updating a page:

1. Start with the standard layout structure
2. Apply consistent spacing and component usage
3. Implement responsive behavior
4. Add page-specific functionality
5. Test on multiple screen sizes

---

This style guide should be followed for all new mockup pages and used as a reference when updating existing ones to ensure a consistent UI across the application.


Include 'use client'; in the beginning in case of creation of any new .tsx file

