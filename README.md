# 🌸 Beautiful To-Do List App

A modern, interactive to-do list application with gamification, mood tracking, and deadline management. Built with vanilla HTML5, CSS3, and JavaScript ES6+.

![To-Do App Preview](https://via.placeholder.com/600x400/ec4899/fce7f3?text=Beautiful+To-Do+App)

## ✨ Features

### 🎯 Core Functionality
- **Add Tasks**: Type and add tasks with optional deadlines
- **Mark Complete**: Check off tasks with visual feedback
- **Delete Tasks**: Remove tasks with smooth animations
- **Data Persistence**: All data saved to localStorage

### 🎮 Gamification System
- **Mood Face**: Animated emoji that changes based on progress
  - 😴 Ready to start (0%)
  - 😐 Getting started (1-24%)
  - 😊 Making progress (25-49%)
  - 😄 You're on fire! (50-74%)
  - 🤩 Almost there! (75-99%)
  - 🎉 Perfect! All done! (100%)
- **Points System**: Earn points for completing tasks
- **Progress Bar**: Visual progress tracking
- **Deadline Bonuses**: Extra points for completing before deadline

### ⏰ Deadline Management
- **DateTime Input**: Set specific deadlines for tasks
- **Visual Indicators**: Color-coded urgency (red=overdue, yellow=due soon)
- **Smart Formatting**: Shows "Due in 2h", "Overdue by 3h", etc.
- **Automatic Penalties**: Lose points for missed deadlines

### 🎨 Beautiful Themes
- **🌙 Dark Theme**: Original blue gradient theme
- **☀️ Light Theme**: Clean light theme
- **🌸 Pink Theme**: Romantic dark pink theme
- **🌺 Pink Light Theme**: Fresh light pink theme

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Glassmorphism**: Modern glass-like UI effects
- **Smooth Animations**: Delightful micro-interactions
- **Accessibility**: ARIA labels and keyboard navigation

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required!

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/bavi404/to-do-list.git
   cd to-do-list
   ```

2. Open `index.html` in your web browser
3. Start adding tasks and watch your productivity soar! 🚀

## 🎯 Usage

### Adding Tasks
1. Type your task in the input field
2. Optionally set a deadline using the datetime picker
3. Click "Add Task" or press Enter

### Managing Tasks
- **Complete**: Click the checkbox or "Complete" button
- **Delete**: Click the "Delete" button
- **View Progress**: Watch the mood face and progress bar update

### Themes
- Use the theme selector dropdown to switch between themes
- Your theme preference is automatically saved

## 🛠️ Technical Details

### File Structure
```
to-do-list/
├── index.html          # Main HTML structure
├── style.css           # All styling and themes
├── script.js           # Application logic
└── README.md           # This file
```

### Technologies Used
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript**: ES6+ features, classes, and modern APIs
- **localStorage**: Client-side data persistence

### Key Features
- **Event Delegation**: Efficient event handling for dynamic content
- **XSS Protection**: HTML escaping for user input
- **Responsive Design**: Mobile-first approach with breakpoints
- **Theme System**: CSS custom properties for easy theming
- **Animation System**: CSS keyframes and transitions

## 🎨 Customization

### Adding New Themes
1. Add new CSS custom properties in `style.css`:
   ```css
   [data-theme="your-theme"] {
       --primary: #your-color;
       --bg: #your-bg;
       /* ... other variables */
   }
   ```

2. Add theme option to the selector in `index.html`
3. Update the theme logic in `script.js` if needed

### Modifying Animations
- Edit the keyframes in `style.css`
- Adjust timing and easing functions
- Add new animation classes as needed

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Poppins Font**: Beautiful typography from Google Fonts
- **CSS Grid & Flexbox**: Modern layout techniques
- **Glassmorphism Design**: Inspired by modern UI trends
- **Gamification**: Inspired by productivity and habit-tracking apps

## 📞 Contact

- **GitHub**: [@bavi404](https://github.com/bavi404)
- **Repository**: [to-do-list](https://github.com/bavi404/to-do-list)

---

Made with ❤️ and lots of ☕. Happy productivity! 🚀
