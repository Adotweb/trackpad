#include <X11/Xlib.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "Usage: %s <dx> <dy>\n", argv[0]);
        return 1;
    }

    // Parse the command line arguments
    int dx = atoi(argv[1]);
    int dy = atoi(argv[2]);

    // Open display
    Display *display = XOpenDisplay(NULL);
    if (display == NULL) {
        fprintf(stderr, "Unable to open display\n");
        return 1;
    }

    // Get the default screen and root window
    int screen = DefaultScreen(display);
    Window root_window = RootWindow(display, screen);

    // Get the current pointer position
    int root_x, root_y;
    int win_x, win_y;
    unsigned int mask;
    Window child_win, root_win;
    XQueryPointer(display, root_window, &root_win, &child_win,
                  &root_x, &root_y, &win_x, &win_y, &mask);

    // Move the pointer by dx and dy
    XWarpPointer(display, None, root_window, 0, 0, 0, 0, root_x + dx, root_y + dy);
    XFlush(display);

    // Close the display
    XCloseDisplay(display);

    return 0;
}
